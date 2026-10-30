import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {registerServiceWorker} from "./service-worker-registration";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

registerServiceWorker();
