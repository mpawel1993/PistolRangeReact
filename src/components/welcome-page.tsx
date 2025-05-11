import logo from '../assets/welcome_logo.png';
import {useNavigate} from "react-router-dom";

export const WelcomePage = () => {

    const navigate = useNavigate();

    return (<div className="container" onClick={() => navigate('/activity-page')}>
        <img src={logo} alt="Logo"/>
    </div>);
}

export default WelcomePage;