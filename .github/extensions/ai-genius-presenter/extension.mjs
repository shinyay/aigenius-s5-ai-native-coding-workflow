// Extension: ai-genius-presenter
// Registers the repository-managed AI Genius S5E1 presentation canvas.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CanvasError, createCanvas, joinSession } from "@github/copilot-sdk/extension";

import { PresenterError, createPresenterInstance } from "./presenter-server.mjs";

const extensionDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(extensionDirectory, "../../..");
const instances = new Map();

const slideNumberSchema = {
    type: "object",
    properties: {
        slide: {
            type: "integer",
            minimum: 1,
            maximum: 10,
            description: "Slide number from 1 to 10.",
        },
    },
    required: ["slide"],
    additionalProperties: false,
};

async function requireInstance(instanceId) {
    const record = instances.get(instanceId);
    if (!record) {
        throw new CanvasError(
            "canvas_not_open",
            "Open the AI Genius Slide Presenter canvas before invoking an action.",
        );
    }
    return record.promise;
}

async function invokePresenter(instanceId, operation) {
    try {
        return await operation(await requireInstance(instanceId));
    } catch (error) {
        if (error instanceof CanvasError) {
            throw error;
        }
        if (error instanceof PresenterError) {
            throw new CanvasError(error.code, error.message);
        }
        throw error;
    }
}

await joinSession({
    canvases: [
        createCanvas({
            id: "ai-genius-slides",
            displayName: "AI Genius Slide Presenter",
            description:
                "Present the repository-managed AI Genius S5E1 Japanese slide deck with keyboard and thumbnail navigation.",
            inputSchema: {
                type: "object",
                properties: {
                    startSlide: {
                        type: "integer",
                        minimum: 1,
                        maximum: 10,
                        description: "Optional slide number to show first.",
                    },
                },
                additionalProperties: false,
            },
            actions: [
                {
                    name: "get_state",
                    description: "Return the current slide number, title, and deck size.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) => instance.getState()),
                },
                {
                    name: "next_slide",
                    description: "Advance to the next slide.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.navigate("next"),
                        ),
                },
                {
                    name: "previous_slide",
                    description: "Return to the previous slide.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.navigate("previous"),
                        ),
                },
                {
                    name: "first_slide",
                    description: "Go to the first slide.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.navigate("first"),
                        ),
                },
                {
                    name: "last_slide",
                    description: "Go to the last slide.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.navigate("last"),
                        ),
                },
                {
                    name: "go_to_slide",
                    description: "Go to a specific slide number.",
                    inputSchema: slideNumberSchema,
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.navigate("goTo", Number(ctx.input?.slide)),
                        ),
                },
                {
                    name: "reload_deck",
                    description: "Reload deck.json and refresh the current slide state.",
                    handler: (ctx) =>
                        invokePresenter(ctx.instanceId, (instance) =>
                            instance.reloadDeck(),
                        ),
                },
            ],
            open: async (ctx) => {
                const requestedSlide = Number(ctx.input?.startSlide || 1);
                let record = instances.get(ctx.instanceId);
                try {
                    if (!record) {
                        record = {
                            closeRequested: false,
                            promise: null,
                        };
                        record.promise = createPresenterInstance({
                            repositoryRoot,
                            extensionDirectory,
                            startSlide: requestedSlide,
                        })
                            .then(async (instance) => {
                                if (record.closeRequested) {
                                    await instance.close();
                                    throw new PresenterError(
                                        "canvas_closed",
                                        "The canvas was closed while it was opening.",
                                    );
                                }
                                return instance;
                            })
                            .catch((error) => {
                                if (instances.get(ctx.instanceId) === record) {
                                    instances.delete(ctx.instanceId);
                                }
                                throw error;
                            });
                        instances.set(ctx.instanceId, record);
                    }

                    const instance = await record.promise;
                    if (ctx.input?.startSlide !== undefined) {
                        instance.navigate("goTo", requestedSlide);
                    }

                    const state = instance.getState();
                    return {
                        title: "AI Genius Slide Presenter",
                        status: `Slide ${state.currentSlide} of ${state.totalSlides}`,
                        url: instance.url,
                    };
                } catch (error) {
                    if (error instanceof PresenterError) {
                        throw new CanvasError(error.code, error.message);
                    }
                    throw error;
                }
            },
            onClose: async (ctx) => {
                const record = instances.get(ctx.instanceId);
                if (record) {
                    instances.delete(ctx.instanceId);
                    record.closeRequested = true;
                    try {
                        const instance = await record.promise;
                        await instance.close();
                    } catch {
                        // The open path already surfaced initialization failures.
                    }
                }
            },
        }),
    ],
});
