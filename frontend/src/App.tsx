import "./App.css";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import WelcomePage from "./components/welcome-page";
import ActivityPage from "./components/activity-page";
import SetOfQuestionsPage from "./components/set-of-questions-page";
import LearnPage from "./components/learn-page";
import ExamPage from "./components/exam-page";
import UpdateBanner from "./components/update-banner";

function App() {
    return (
        <div className="app">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<WelcomePage/>}/>
                    <Route path="/activity-page" element={<ActivityPage/>}/>
                    <Route path="/set-of-questions" element={<SetOfQuestionsPage/>}/>
                    <Route path="/nauka/:category" element={<LearnPage/>}/>
                    <Route path="/exam-page" element={<ExamPage/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </HashRouter>
            <UpdateBanner/>
        </div>
    );
}

export default App;
