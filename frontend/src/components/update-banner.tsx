import {activateUpdate, useWaitingServiceWorker} from "../service-worker-registration";

export const UpdateBanner = () => {
    const worker = useWaitingServiceWorker();
    if (!worker) {
        return null;
    }

    return (
        <div className="update-banner" role="status">
            <span>Dostępna nowa wersja aplikacji</span>
            <button type="button" className="menu-button" onClick={() => activateUpdate(worker)}>ODŚWIEŻ</button>
        </div>
    );
}

export default UpdateBanner;
