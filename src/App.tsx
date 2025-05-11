import React, {useEffect} from 'react';
import './App.css';
import WelcomePage from "./components/welcome-page";
import {useSetAtom} from "jotai";
import {allQuestionsAtom} from "./atoms";

function App() {

    const setAllQuestions = useSetAtom(allQuestionsAtom);

    useEffect(() => {
        return setAllQuestions(JSON.parse(JSON.stringify(require('../src/assets/questionList.json'))));
    }, []);

    return (
        <div>
            <WelcomePage/>
        </div>
    );
}

export default App;
