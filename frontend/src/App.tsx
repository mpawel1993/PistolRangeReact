import './App.css';
import WelcomePage from "./components/welcome-page";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SetOfQuestionsPage from "./components/set-of-questions-page";
import LearnPage from "./components/learn-page";
import ActivityPage from "./components/activity-page";
import ExamPage from "./components/exam-page";
import EndOfModuleModal from "./components/end-of-module-modal";
import ExamSummary from "./components/exam-summary";

function App() {
    return (
        <div style={{
            maxWidth: '1000px',
            justifyContent: 'center',
            margin: 'auto'
        }}>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage/>}/>
                    <Route path="/set-of-questions" element={<SetOfQuestionsPage/>}/>
                    <Route path="/nauka/:param" element={<LearnPage/>}/>
                    <Route path="/activity-page" element={<ActivityPage/>}/>
                    <Route path="/exam-page" element={<ExamPage/>}/>
                    <Route path="/end-of-module" element={<EndOfModuleModal/>}/>
                    <Route path="/exam-summary" element={<ExamSummary/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
