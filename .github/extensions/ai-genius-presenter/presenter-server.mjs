import { createServer } from "node:http";
import { access, readFile, realpath } from "node:fs/promises";
import { basename, isAbsolute, relative, resolve } from "node:path";

export class PresenterError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "PresenterError";
        this.code = code;
    }
}

function isWithin(parent, candidate) {
    const pathFromParent = relative(parent, candidate);
    return pathFromParent !== "" && !pathFromParent.startsWith("..") && !isAbsolute(pathFromParent);
}

async function loadDeck(deckDirectory, repositoryRoot) {
    const realRepositoryRoot = await realpath(repositoryRoot);
    const realDeckDirectory = await realpath(deckDirectory);
    if (!isWithin(realRepositoryRoot, realDeckDirectory)) {
        throw new PresenterError(
            "deck_invalid",
            "The presentation directory resolves outside the repository.",
        );
    }

    const deckPath = resolve(realDeckDirectory, "deck.json");
    const slidesRoot = resolve(realDeckDirectory, "slides");
    const realSlidesRoot = await realpath(slidesRoot);
    if (!isWithin(realDeckDirectory, realSlidesRoot)) {
        throw new PresenterError(
            "deck_invalid",
            "The slides directory resolves outside the presentation directory.",
        );
    }
    const raw = JSON.parse(await readFile(deckPath, "utf8"));
    if (
        !raw ||
        raw.version !== 1 ||
        typeof raw.id !== "string" ||
        typeof raw.title !== "string" ||
        !Array.isArray(raw.slides) ||
        raw.slides.length === 0
    ) {
        throw new PresenterError(
            "deck_invalid",
            "deck.json does not contain a valid version 1 slide deck.",
        );
    }

    const slides = [...raw.slides].sort((left, right) => left.number - right.number);
    const seenFiles = new Set();
    const slidePaths = new Map();

    for (const [index, slide] of slides.entries()) {
        const expectedNumber = index + 1;
        if (
            slide.number !== expectedNumber ||
            typeof slide.file !== "string" ||
            typeof slide.title !== "string" ||
            typeof slide.sourceFile !== "string" ||
            typeof slide.sha256 !== "string"
        ) {
            throw new PresenterError(
                "deck_invalid",
                `Slide ${expectedNumber} has invalid metadata.`,
            );
        }

        const expectedFilePattern = /^slides\/[^/\\]+\.jpe?g$/i;
        if (!expectedFilePattern.test(slide.file) || slide.file.includes("..")) {
            throw new PresenterError(
                "deck_invalid",
                `Slide ${expectedNumber} must reference one JPEG directly inside slides/.`,
            );
        }

        const slideName = basename(slide.file);
        if (seenFiles.has(slideName)) {
            throw new PresenterError("deck_invalid", `Duplicate slide filename: ${slideName}`);
        }
        seenFiles.add(slideName);
        const slidePath = resolve(realSlidesRoot, slideName);
        const realSlidePath = await realpath(slidePath);
        if (!isWithin(realSlidesRoot, realSlidePath)) {
            throw new PresenterError(
                "deck_invalid",
                `Slide ${expectedNumber} resolves outside the slides directory.`,
            );
        }
        await access(slidePath);
        slidePaths.set(slideName, realSlidePath);
    }

    return {
        deck: {
            version: raw.version,
            id: raw.id,
            title: raw.title,
            aspectRatio: raw.aspectRatio || "16:9",
            slides,
        },
        slidePaths,
    };
}

function getState(entry) {
    const slide = entry.deck.slides[entry.currentSlide - 1];
    return {
        currentSlide: entry.currentSlide,
        totalSlides: entry.deck.slides.length,
        title: slide.title,
        file: slide.file,
        canPrevious: entry.currentSlide > 1,
        canNext: entry.currentSlide < entry.deck.slides.length,
        revision: entry.revision,
    };
}

function writeSecurityHeaders(response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Permissions-Policy", "fullscreen=(self)");
    response.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'",
    );
}

function sendJson(response, statusCode, value) {
    writeSecurityHeaders(response);
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
    });
    response.end(JSON.stringify(value));
}

function sendText(response, statusCode, message) {
    writeSecurityHeaders(response);
    response.writeHead(statusCode, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
    });
    response.end(message);
}

async function sendFile(response, filePath, contentType, cacheControl = "no-store") {
    const body = await readFile(filePath);
    writeSecurityHeaders(response);
    response.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": body.length,
        "Cache-Control": cacheControl,
    });
    response.end(body);
}

function broadcast(entry, event) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of [...entry.clients]) {
        if (client.destroyed || client.writableEnded) {
            entry.clients.delete(client);
        } else {
            client.write(payload);
        }
    }
}

function broadcastState(entry) {
    broadcast(entry, { type: "state", state: getState(entry) });
}

function setCurrentSlide(entry, targetSlide) {
    if (
        !Number.isInteger(targetSlide) ||
        targetSlide < 1 ||
        targetSlide > entry.deck.slides.length
    ) {
        throw new PresenterError(
            "invalid_slide",
            `slide must be an integer from 1 to ${entry.deck.slides.length}.`,
        );
    }

    if (entry.currentSlide !== targetSlide) {
        entry.currentSlide = targetSlide;
        entry.revision += 1;
        broadcastState(entry);
    }
    return getState(entry);
}

function navigate(entry, action, slide) {
    switch (action) {
        case "next":
            return setCurrentSlide(
                entry,
                Math.min(entry.currentSlide + 1, entry.deck.slides.length),
            );
        case "previous":
            return setCurrentSlide(entry, Math.max(entry.currentSlide - 1, 1));
        case "first":
            return setCurrentSlide(entry, 1);
        case "last":
            return setCurrentSlide(entry, entry.deck.slides.length);
        case "goTo":
            return setCurrentSlide(entry, slide);
        default:
            throw new PresenterError(
                "invalid_navigation",
                `Unknown navigation action: ${action}`,
            );
    }
}

async function readJsonBody(request) {
    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of request) {
        totalBytes += chunk.length;
        if (totalBytes > 4096) {
            throw new PresenterError(
                "request_too_large",
                "Navigation request body is too large.",
            );
        }
        chunks.push(chunk);
    }

    if (chunks.length === 0) {
        return {};
    }

    try {
        return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
        throw new PresenterError(
            "invalid_json",
            "Navigation request must contain valid JSON.",
        );
    }
}

async function handleRequest(entry, request, response) {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");

    if (request.method === "GET" && entry.viewerAssets.has(requestUrl.pathname)) {
        const asset = entry.viewerAssets.get(requestUrl.pathname);
        await sendFile(response, asset.path, asset.type);
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/favicon.ico") {
        writeSecurityHeaders(response);
        response.writeHead(204);
        response.end();
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/deck") {
        sendJson(response, 200, { deck: entry.deck, state: getState(entry) });
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/state") {
        sendJson(response, 200, getState(entry));
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/events") {
        writeSecurityHeaders(response);
        response.writeHead(200, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-store",
            Connection: "keep-alive",
        });
        response.write(`data: ${JSON.stringify({ type: "state", state: getState(entry) })}\n\n`);
        entry.clients.add(response);
        request.on("close", () => entry.clients.delete(response));
        return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/navigate") {
        try {
            const input = await readJsonBody(request);
            sendJson(response, 200, navigate(entry, input.action, input.slide));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Navigation failed.";
            sendJson(response, 400, { error: message });
        }
        return;
    }

    if (request.method === "GET" && requestUrl.pathname.startsWith("/slides/")) {
        let requestedName;
        try {
            requestedName = decodeURIComponent(requestUrl.pathname.slice("/slides/".length));
        } catch {
            sendText(response, 400, "Invalid slide path.");
            return;
        }

        const slidePath = entry.slidePaths.get(requestedName);
        if (!slidePath || requestedName !== basename(requestedName)) {
            sendText(response, 404, "Slide not found.");
            return;
        }
        await sendFile(response, slidePath, "image/jpeg", "public, max-age=3600");
        return;
    }

    sendText(response, 404, "Not found.");
}

export async function createPresenterInstance({
    repositoryRoot,
    extensionDirectory,
    startSlide,
}) {
    const deckDirectory = resolve(repositoryRoot, "presentation/ai-genius-s5e1");
    const loadedDeck = await loadDeck(deckDirectory, repositoryRoot);
    const entry = {
        deckDirectory,
        viewerAssets: new Map([
            [
                "/",
                {
                    path: resolve(extensionDirectory, "viewer.html"),
                    type: "text/html; charset=utf-8",
                },
            ],
            [
                "/viewer.css",
                {
                    path: resolve(extensionDirectory, "viewer.css"),
                    type: "text/css; charset=utf-8",
                },
            ],
            [
                "/viewer.js",
                {
                    path: resolve(extensionDirectory, "viewer.js"),
                    type: "text/javascript; charset=utf-8",
                },
            ],
        ]),
        server: null,
        url: "",
        deck: loadedDeck.deck,
        slidePaths: loadedDeck.slidePaths,
        currentSlide: 1,
        revision: 1,
        clients: new Set(),
        heartbeat: null,
        closed: false,
    };

    setCurrentSlide(entry, startSlide);

    const server = createServer((request, response) => {
        handleRequest(entry, request, response).catch(() => {
            if (response.headersSent) {
                response.end();
            } else {
                sendJson(response, 500, { error: "Canvas request failed." });
            }
        });
    });

    await new Promise((resolvePromise, rejectPromise) => {
        server.once("error", rejectPromise);
        server.listen(0, "127.0.0.1", () => {
            server.removeListener("error", rejectPromise);
            resolvePromise();
        });
    });

    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    entry.server = server;
    entry.url = `http://127.0.0.1:${port}/`;
    entry.heartbeat = setInterval(() => {
        for (const client of [...entry.clients]) {
            if (client.destroyed || client.writableEnded) {
                entry.clients.delete(client);
            } else {
                client.write(": keep-alive\n\n");
            }
        }
    }, 15000);
    entry.heartbeat.unref();

    return {
        url: entry.url,
        getState: () => getState(entry),
        navigate: (action, slide) => navigate(entry, action, slide),
        reloadDeck: async () => {
            const reloadedDeck = await loadDeck(entry.deckDirectory, repositoryRoot);
            entry.deck = reloadedDeck.deck;
            entry.slidePaths = reloadedDeck.slidePaths;
            entry.currentSlide = Math.min(entry.currentSlide, entry.deck.slides.length);
            entry.revision += 1;
            broadcast(entry, { type: "deck", deck: entry.deck, state: getState(entry) });
            return getState(entry);
        },
        close: async () => {
            if (entry.closed) {
                return;
            }
            entry.closed = true;
            clearInterval(entry.heartbeat);
            for (const client of entry.clients) {
                client.end();
            }
            entry.clients.clear();
            await new Promise((resolvePromise) => entry.server.close(() => resolvePromise()));
        },
    };
}
