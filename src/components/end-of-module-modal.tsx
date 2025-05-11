import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export const EndOfModuleModal = () => {

    const navigate = useNavigate();

    const handleQuit = () => {
        navigate('/activity-page');
    }

    return (<div style={{color: 'red' , height:20}}>
        Brawo ukonczyles modul
        <button  style={navButtonStyle} onClick={() => handleQuit()} >
            <HomeIcon />
        </button>
    </div>)
}

const navButtonStyle = {
    padding: 15,
    margin: 10,
    fontFamily: 'Bahnschrift',
    fontSize: 20,
    background: "linear-gradient(to right, #94c02b, #71912a)",
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
}

export default EndOfModuleModal;