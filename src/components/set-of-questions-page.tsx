import {allQuestionsAtom, categories} from "../atoms";
import Field from "./field";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";

const SetOfQuestionsPage = () => {

    const navigate = useNavigate();
    const baseQuestions = useAtomValue(allQuestionsAtom);

    const handleNavigateToAll = (categoryName:string) => {
        let storageKey = 'all';
        navigate('/learining-page', {
            state: {
                inputParams: {questions: baseQuestions, categoryName, storageKey},
            }
        });
    }

    return (<div>
        <div onClick={() => handleNavigateToAll(categories[0])}>
            <Field text={categories[0]}/>
        </div>

        <Field text={categories[1]}/>
        <Field text={categories[2]}/>
        <Field text={categories[3]}/>
        <Field text={categories[4]}/>
        <Field text={categories[5]}/>
        <Field text={categories[6]}/>
    </div>);
}

export default SetOfQuestionsPage;