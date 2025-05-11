import React, {useEffect} from 'react';
import './App.css';
import WelcomePage from "./components/welcome-page";
import {useSetAtom} from "jotai";
import {allQuestionsAtom} from "./atoms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetOfQuestionsPage from "./components/set-of-questions-page";
import LearningPage from "./components/learning-page";
import ActivityPage from "./components/activity-page";
import ExamPage from "./components/exam-page";

function App() {

    const setAllQuestions = useSetAtom(allQuestionsAtom);

    useEffect(() => {
        setAllQuestions(JSON.parse(JSON.stringify(require('../src/assets/questionList.json'))));
    }, []);

    return (
        <div style={{
            maxWidth: '1000px',
            justifyContent: 'center',
            margin: 'auto'
        }}>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage/>} />
                    <Route path="/set-of-questions" element={<SetOfQuestionsPage />} />
                    <Route path="/learining-page" element={<LearningPage/>} />
                    <Route path="/activity-page" element={<ActivityPage/>} />
                    <Route path="/exam-page" element={<ExamPage/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
