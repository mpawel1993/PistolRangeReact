import logo from '../assets/welcome_logo.png';
import {useNavigate} from "react-router-dom";

export const WelcomePage = () => {

    const navigate = useNavigate();

    return (<div  style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }} onClick={() => navigate('/activity-page')}>
        <img style={{
            width:'90%',
            height: 'auto'
        }} src={logo} alt="Logo"/>
    </div>);
}

export default WelcomePage;