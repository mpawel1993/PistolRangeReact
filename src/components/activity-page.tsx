import {allQuestionsAtom, categories} from "../atoms";
import Field from "./field";
import {Question} from "../model/model";
import {useAtomValue} from "jotai/index";
import {useNavigate} from "react-router-dom";

export const ActivityPage = () => {
    const navigate = useNavigate();

    const baseQuestions = useAtomValue(allQuestionsAtom);

    const navigateToExam = () => {
        let numbers = [];
        let min, max, r, n, p;
        min = 1;
        max = 200;
        r = 10;

        for (let i = 0; i < r; i++) {
            do {
                n = Math.floor(Math.random() * (max - min + 1)) + min;
                p = numbers.includes(n);
                if (!p) {
                    numbers.push(n);
                }
            }
            while (p);
        }

        let finalQuestions: Question[] = [];
        numbers.forEach(a => {
            let question = baseQuestions.filter(q => q.id == a)[0];
            finalQuestions.push(question);
        });

        assignId(finalQuestions);
        navigate('/exam-page', {state: {questions: finalQuestions}})
    }

    const assignId = (array: any[]) => {
        let index = 1;
        array.forEach(a => {
            a.id = index;
            index++;
        });
    }

    return (<div>
        <div onClick={() => navigate('/set-of-questions')}>
            <Field text='NAUKA'/>
        </div>
        <div onClick={() => navigateToExam()}>
            <Field text='EGZAMIN'/>
        </div>
    </div>);
}

export default ActivityPage;