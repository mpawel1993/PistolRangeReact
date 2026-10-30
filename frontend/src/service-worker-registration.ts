import {useSyncExternalStore} from "react";

let waitingWorker: ServiceWorker | null = null;
const listeners = new Set<() => void>();

const setWaitingWorker = (worker: ServiceWorker) => {
    waitingWorker = worker;
    listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export const useWaitingServiceWorker = () => useSyncExternalStore(subscribe, () => waitingWorker);

export function registerServiceWorker() {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
        return;
    }
    window.addEventListener("load", () => {
        navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
            .then(registration => {
                if (registration.waiting && navigator.serviceWorker.controller) {
                    setWaitingWorker(registration.waiting);
                }
                registration.addEventListener("updatefound", () => {
                    const installing = registration.installing;
                    installing?.addEventListener("statechange", () => {
                        // A controller already exists, so this is an update rather than the first install.
                        if (installing.state === "installed" && navigator.serviceWorker.controller) {
                            setWaitingWorker(installing);
                        }
                    });
                });
            })
            .catch(console.error);
    });
}

export function activateUpdate(worker: ServiceWorker) {
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), {once: true});
    worker.postMessage({type: "SKIP_WAITING"});
}
