import {allQuestionsAtom, categories} from "../atoms";
import Field from "./field";
import {Question} from "../model/model";
import {useAtomValue} from "jotai/index";
import {useNavigate} from "react-router-dom";
import welcomeMessage from "../assets/welcome_message.png";

export const ActivityPage = () => {
    const navigate = useNavigate();
    return (<div>
        <br/>
        <br/>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <img style={{
                width: '90%',
                height: 'auto'
            }} src={welcomeMessage} alt="Logo"/>
        </div>
        <br/>
        <div onClick={() => navigate('/set-of-questions')}>
            <Field text='NAUKA'/>
        </div>
        <div onClick={() => navigate('/exam-page', {state: {questions: []}})}>
            <Field text='EGZAMIN'/>
        </div>
    </div>);
}

export default ActivityPage;