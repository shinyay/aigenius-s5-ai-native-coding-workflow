"use strict";

const elements = {
  app: document.querySelector("#app"),
  deckTitle: document.querySelector("#deck-title"),
  connectionStatus: document.querySelector("#connection-status"),
  connectionText: document.querySelector("#connection-text"),
  viewer: document.querySelector("#viewer"),
  stage: document.querySelector("#stage"),
  stageMessage: document.querySelector("#stage-message"),
  stageMessageText: document.querySelector("#stage-message-text"),
  retryButton: document.querySelector("#retry-button"),
  slideImage: document.querySelector("#slide-image"),
  controls: document.querySelector("#controls"),
  currentSlide: document.querySelector("#current-slide"),
  totalSlides: document.querySelector("#total-slides"),
  firstButton: document.querySelector("#first-button"),
  previousButton: document.querySelector("#previous-button"),
  nextButton: document.querySelector("#next-button"),
  lastButton: document.querySelector("#last-button"),
  thumbnailsButton: document.querySelector("#thumbnails-button"),
  fullscreenButton: document.querySelector("#fullscreen-button"),
  thumbnailRail: document.querySelector("#thumbnail-rail"),
  closeThumbnailsButton: document.querySelector("#close-thumbnails-button"),
  thumbnailList: document.querySelector("#thumbnail-list"),
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const presentationIdleDelay = 2200;

let deck = null;
let viewerState = null;
let eventSource = null;
let reconnectTimer = null;
let presentationTimer = null;
let presentationActive = false;
let presentationUsesFullscreen = false;
let thumbnailsOpen = false;
let renderedSlideKey = "";
let imageLoadToken = 0;
let navigationQueue = Promise.resolve();

function setConnection(kind, message) {
  elements.connectionStatus.dataset.kind = kind;
  elements.connectionText.textContent = message;
}

function showStageMessage(message, kind = "loading", canRetry = false) {
  elements.stageMessage.hidden = false;
  elements.stageMessage.dataset.kind = kind;
  elements.stageMessageText.textContent = message;
  elements.retryButton.hidden = !canRetry;
  elements.stageMessage.setAttribute("role", kind === "error" ? "alert" : "status");
}

function hideStageMessage() {
  elements.stageMessage.hidden = true;
  elements.retryButton.hidden = true;
}

function slideBasename(file) {
  return String(file || "").split(/[\\/]/).pop();
}

function slideUrl(slide) {
  const checksum = encodeURIComponent(slide.sha256 || "");
  return `/slides/${encodeURIComponent(slideBasename(slide.file))}?v=${checksum}`;
}

function normalizedAspectRatio(aspectRatio) {
  const match = String(aspectRatio || "").match(
    /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/,
  );

  if (!match || Number(match[1]) <= 0 || Number(match[2]) <= 0) {
    return "16 / 9";
  }

  return `${match[1]} / ${match[2]}`;
}

function validateDeckPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("The deck response was empty.");
  }

  if (!payload.deck || !Array.isArray(payload.deck.slides)) {
    throw new Error("The deck response is missing its slide manifest.");
  }

  if (!payload.state || typeof payload.state !== "object") {
    throw new Error("The deck response is missing presentation state.");
  }

  return payload;
}

function findCurrentSlide() {
  if (!deck || !viewerState || deck.slides.length === 0) {
    return null;
  }

  const requestedNumber = Number(viewerState.currentSlide);
  const byNumber = deck.slides.find(
    (slide) => Number(slide.number) === requestedNumber,
  );

  if (byNumber) {
    return byNumber;
  }

  const requestedFile = slideBasename(viewerState.file);
  const byFile = requestedFile
    ? deck.slides.find((slide) => slideBasename(slide.file) === requestedFile)
    : null;

  return byFile || deck.slides[Math.max(0, requestedNumber - 1)] || deck.slides[0];
}

function buildThumbnails() {
  elements.thumbnailList.replaceChildren();

  if (!deck) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const slide of deck.slides) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const imageWrap = document.createElement("span");
    const image = document.createElement("img");
    const number = document.createElement("span");
    const title = document.createElement("span");
    const slideTitle = slide.title || `Slide ${slide.number}`;

    button.type = "button";
    button.className = "thumbnail-button";
    button.dataset.slideNumber = String(slide.number);
    button.setAttribute("aria-label", `Go to slide ${slide.number}: ${slideTitle}`);
    button.addEventListener("click", () => {
      navigate("goTo", Number(slide.number));
    });

    imageWrap.className = "thumbnail-image-wrap";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = slideUrl(slide);
    image.alt = `Preview of ${slideTitle}`;

    number.className = "thumbnail-number";
    number.textContent = String(slide.number);
    number.setAttribute("aria-hidden", "true");

    title.className = "thumbnail-title";
    title.textContent = slideTitle;

    imageWrap.append(image, number);
    button.append(imageWrap, title);
    item.append(button);
    fragment.append(item);
  }

  elements.thumbnailList.append(fragment);
}

function updateSelectedThumbnail(slide, shouldScroll = true) {
  const selectedNumber = String(slide?.number ?? "");
  let selectedButton = null;

  for (const button of elements.thumbnailList.querySelectorAll(
    ".thumbnail-button",
  )) {
    const selected = button.dataset.slideNumber === selectedNumber;

    if (selected) {
      button.setAttribute("aria-current", "page");
      selectedButton = button;
    } else {
      button.removeAttribute("aria-current");
    }
  }

  if (selectedButton && thumbnailsOpen && shouldScroll) {
    selectedButton.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  }
}

function renderState(nextState, shouldScrollThumbnail = true) {
  if (!deck || !nextState) {
    return;
  }

  const currentRevision = Number(viewerState?.revision ?? -1);
  const nextRevision = Number(nextState.revision ?? currentRevision);
  if (viewerState && nextRevision < currentRevision) {
    return;
  }

  viewerState = { ...viewerState, ...nextState };
  const slide = findCurrentSlide();
  const currentNumber = Number(slide?.number || viewerState.currentSlide || 0);
  const totalSlides = Number(viewerState.totalSlides || deck.slides.length);
  const hasPrevious = currentNumber > 1;
  const hasNext = currentNumber > 0 && currentNumber < totalSlides;

  elements.currentSlide.textContent = currentNumber > 0 ? String(currentNumber) : "—";
  elements.totalSlides.textContent = totalSlides > 0 ? String(totalSlides) : "0";
  elements.firstButton.disabled = !hasPrevious;
  elements.previousButton.disabled = !hasPrevious;
  elements.nextButton.disabled = !hasNext;
  elements.lastButton.disabled = !hasNext;
  updateSelectedThumbnail(slide, shouldScrollThumbnail);

  if (!slide) {
    renderedSlideKey = "";
    elements.slideImage.hidden = true;
    showStageMessage("This presentation does not contain any slides.", "error");
    return;
  }

  const slideTitle = slide.title || `Slide ${slide.number}`;
  const nextKey = `${slide.number}:${slide.file}:${slide.sha256 || ""}`;
  document.title = `${slideTitle} — ${deck.title || "Presentation"}`;

  if (nextKey === renderedSlideKey) {
    elements.slideImage.alt = slideTitle;
    return;
  }

  renderedSlideKey = nextKey;
  imageLoadToken += 1;
  const loadToken = imageLoadToken;

  showStageMessage(`Loading slide ${slide.number}…`);
  elements.slideImage.hidden = true;
  elements.slideImage.alt = slideTitle;
  elements.slideImage.onload = () => {
    if (loadToken !== imageLoadToken) {
      return;
    }

    elements.slideImage.hidden = false;
    hideStageMessage();
  };
  elements.slideImage.onerror = () => {
    if (loadToken !== imageLoadToken) {
      return;
    }

    elements.slideImage.hidden = true;
    showStageMessage(
      `Slide ${slide.number} could not be loaded. Check the presentation files and try again.`,
      "error",
      true,
    );
  };
  elements.slideImage.src = slideUrl(slide);
}

async function loadDeck() {
  elements.app.setAttribute("aria-busy", "true");
  setConnection("loading", "Loading deck…");
  showStageMessage("Loading presentation…");

  try {
    const response = await fetch("/deck", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`The deck server returned ${response.status}.`);
    }

    const payload = validateDeckPayload(await response.json());
    deck = payload.deck;
    viewerState = payload.state;
    elements.deckTitle.textContent = deck.title || viewerState.title || "Presentation";
    document.documentElement.style.setProperty(
      "--deck-aspect-ratio",
      normalizedAspectRatio(deck.aspectRatio),
    );
    buildThumbnails();
    renderState(viewerState, false);
    connectEvents();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The presentation could not be loaded.";
    setConnection("error", "Deck unavailable");
    showStageMessage(`${message} Try again when the server is available.`, "error", true);
  } finally {
    elements.app.setAttribute("aria-busy", "false");
  }
}

function connectEvents() {
  clearTimeout(reconnectTimer);

  if (eventSource) {
    eventSource.close();
  }

  setConnection("loading", "Connecting…");
  eventSource = new EventSource("/events");

  eventSource.onopen = () => {
    setConnection("connected", "Live");
  };

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);

      if (payload.type === "state" && payload.state) {
        setConnection("connected", "Live");
        renderState(payload.state);
      } else if (payload.type === "deck" && payload.deck && payload.state) {
        const nextPayload = validateDeckPayload({
          deck: payload.deck,
          state: payload.state,
        });
        const currentRevision = Number(viewerState?.revision ?? -1);
        const incomingRevision = Number(nextPayload.state.revision ?? currentRevision);
        const stateToRender =
          viewerState && incomingRevision < currentRevision
            ? viewerState
            : nextPayload.state;
        deck = nextPayload.deck;
        elements.deckTitle.textContent = deck.title || stateToRender.title || "Presentation";
        document.documentElement.style.setProperty(
          "--deck-aspect-ratio",
          normalizedAspectRatio(deck.aspectRatio),
        );
        renderedSlideKey = "";
        buildThumbnails();
        setConnection("connected", "Live");
        renderState(stateToRender, false);
      }
    } catch {
      setConnection("error", "Invalid live update");
    }
  };

  eventSource.onerror = () => {
    setConnection("loading", "Reconnecting…");

    if (eventSource?.readyState === EventSource.CLOSED) {
      eventSource.close();
      eventSource = null;
      reconnectTimer = window.setTimeout(connectEvents, 1500);
    }
  };
}

async function sendNavigation(action, slide) {
  const body = { action };

  if (action === "goTo") {
    body.slide = slide;
  }

  const response = await fetch("/navigate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Navigation failed with status ${response.status}.`);
  }

  renderState(await response.json());
}

function navigate(action, slide) {
  if (!deck) {
    return;
  }

  showPresentationControls();
  navigationQueue = navigationQueue
    .then(() => sendNavigation(action, slide))
    .catch(() => {
      setConnection("error", "Navigation unavailable");
      showStageMessage(
        "The viewer could not change slides. Check the connection and try again.",
        "error",
        true,
      );
    });
}

function setThumbnails(open) {
  thumbnailsOpen = Boolean(open) && !presentationActive;
  elements.viewer.classList.toggle("thumbnails-open", thumbnailsOpen);
  elements.thumbnailRail.hidden = !thumbnailsOpen;
  elements.thumbnailsButton.setAttribute("aria-expanded", String(thumbnailsOpen));
  elements.thumbnailsButton.setAttribute(
    "aria-label",
    thumbnailsOpen ? "Hide thumbnails" : "Show thumbnails",
  );

  if (thumbnailsOpen) {
    updateSelectedThumbnail(findCurrentSlide());
  }
}

function activatePresentationMode() {
  presentationActive = true;
  setThumbnails(false);
  document.body.classList.add("presentation-mode");
  elements.fullscreenButton.setAttribute("aria-pressed", "true");
  elements.fullscreenButton.setAttribute(
    "aria-label",
    "Exit fullscreen presentation mode",
  );
  showPresentationControls();
}

function enterPresentationMode() {
  let fullscreenRequest = null;

  try {
    fullscreenRequest = document.documentElement.requestFullscreen?.();
  } catch {
    fullscreenRequest = null;
  }

  activatePresentationMode();

  if (fullscreenRequest && typeof fullscreenRequest.then === "function") {
    fullscreenRequest
      .then(() => {
        presentationUsesFullscreen = true;
      })
      .catch(() => {
        presentationUsesFullscreen = false;
        setConnection("loading", "Presentation mode");
      });
  } else {
    presentationUsesFullscreen = false;
    setConnection("loading", "Presentation mode");
  }
}

function leavePresentationMode() {
  presentationActive = false;
  presentationUsesFullscreen = false;
  clearTimeout(presentationTimer);
  document.body.classList.remove("presentation-mode", "chrome-hidden");
  elements.fullscreenButton.setAttribute("aria-pressed", "false");
  elements.fullscreenButton.setAttribute(
    "aria-label",
    "Enter fullscreen presentation mode",
  );

  if (document.fullscreenElement && document.exitFullscreen) {
    const exitRequest = document.exitFullscreen();
    exitRequest?.catch?.(() => {});
  }
}

function togglePresentationMode() {
  if (presentationActive || document.fullscreenElement) {
    leavePresentationMode();
  } else {
    enterPresentationMode();
  }
}

function showPresentationControls() {
  if (!presentationActive) {
    return;
  }

  clearTimeout(presentationTimer);
  document.body.classList.remove("chrome-hidden");
  presentationTimer = window.setTimeout(() => {
    if (!elements.controls.matches(":focus-within")) {
      document.body.classList.add("chrome-hidden");
    }
  }, presentationIdleDelay);
}

function retryCurrentOperation() {
  if (!deck) {
    loadDeck();
    return;
  }

  const slide = findCurrentSlide();
  renderedSlideKey = "";

  if (slide) {
    renderState(viewerState, false);
  }

  if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
    connectEvents();
  }
}

function isSpaceActivationTarget(target) {
  return target instanceof HTMLElement && Boolean(target.closest("button, a, input"));
}

function handleKeyboard(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  showPresentationControls();

  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
      event.preventDefault();
      navigate("next");
      break;
    case " ":
      if (!isSpaceActivationTarget(event.target)) {
        event.preventDefault();
        navigate("next");
      }
      break;
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      navigate("previous");
      break;
    case "Home":
      event.preventDefault();
      navigate("first");
      break;
    case "End":
      event.preventDefault();
      navigate("last");
      break;
    case "f":
    case "F":
      event.preventDefault();
      togglePresentationMode();
      break;
    case "t":
    case "T":
      event.preventDefault();
      setThumbnails(!thumbnailsOpen);
      break;
    case "Escape":
      if (presentationActive || document.fullscreenElement) {
        event.preventDefault();
        leavePresentationMode();
      }
      break;
    default:
      break;
  }
}

elements.firstButton.addEventListener("click", () => navigate("first"));
elements.previousButton.addEventListener("click", () => navigate("previous"));
elements.nextButton.addEventListener("click", () => navigate("next"));
elements.lastButton.addEventListener("click", () => navigate("last"));
elements.thumbnailsButton.addEventListener("click", () => {
  setThumbnails(!thumbnailsOpen);
});
elements.closeThumbnailsButton.addEventListener("click", () => setThumbnails(false));
elements.fullscreenButton.addEventListener("click", togglePresentationMode);
elements.retryButton.addEventListener("click", retryCurrentOperation);

document.addEventListener("keydown", handleKeyboard);
document.addEventListener("pointermove", showPresentationControls);
document.addEventListener("pointerdown", showPresentationControls);
document.addEventListener("focusin", showPresentationControls);
elements.controls.addEventListener("focusout", showPresentationControls);

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && presentationActive && presentationUsesFullscreen) {
    leavePresentationMode();
  }
});

window.addEventListener("beforeunload", () => {
  clearTimeout(reconnectTimer);
  clearTimeout(presentationTimer);
  eventSource?.close();
});

loadDeck();
