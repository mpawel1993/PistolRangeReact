/// <reference lib="webworker" />
import {cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute} from "workbox-precaching";
import {NavigationRoute, registerRoute} from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

// The build injects every file from build/ here, so the whole app works offline after the first visit.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL(new URL("index.html", self.location.href).href)));

self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
