import {useNavigate} from "react-router-dom";
import MenuButton from "./menu-button";
import welcomeMessage from "../assets/welcome_message.png";

export const ActivityPage = () => {
    const navigate = useNavigate();

    return (
        <main className="page">
            <img className="hero" src={welcomeMessage} alt="Witaj"/>
            <div className="menu">
                <MenuButton onClick={() => navigate("/set-of-questions")}>NAUKA</MenuButton>
                <MenuButton onClick={() => navigate("/set-of-questions?random=true")}>NAUKA (LOSOWE PYTANIA)</MenuButton>
                <MenuButton onClick={() => navigate("/exam-page")}>EGZAMIN</MenuButton>
            </div>
        </main>
    );
}

export default ActivityPage;
