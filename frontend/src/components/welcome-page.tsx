import {useNavigate} from "react-router-dom";
import logo from "../assets/welcome_logo.png";

export const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <button type="button" className="welcome" onClick={() => navigate("/activity-page")}>
            <img src={logo} alt="Pistol Range"/>
        </button>
    );
}

export default WelcomePage;
