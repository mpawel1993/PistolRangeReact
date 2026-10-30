import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import RuleIcon from "@mui/icons-material/Rule";
import QuestionCard from "./question-card";
import QuestionNav from "./question-nav";
import AppModal from "./app-modal";
import MenuButton from "./menu-button";
import passed from "../assets/passed.gif";
import failed from "../assets/failed.gif";
import {AnswerState} from "../model";
import {EXAM, loadExamQuestions} from "../services/question-service";

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} min: ${String(seconds % 60).padStart(2, "0")}`;

export const ExamPage = () => {
    const navigate = useNavigate();
    const [questions] = useState(loadExamQuestions);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [index, setIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [deadline] = useState(() => Date.now() + EXAM.durationSeconds * 1000);
    const [now, setNow] = useState(Date.now);

    const timeLeft = Math.max(0, Math.ceil((deadline - now) / 1000));

    useEffect(() => {
        if (isFinished) {
            return;
        }
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [isFinished]);

    useEffect(() => {
        if (timeLeft === 0 && !isFinished) {
            setIsFinished(true);
            setIsSummaryOpen(true);
        }
    }, [timeLeft, isFinished]);

    const question = questions[index];
    const given = answers[index];
    const goodAnswers = questions.filter((q, i) => answers[i] === q.goodAnswer).length;

    const finish = () => {
        setIsFinished(true);
        setIsSummaryOpen(true);
    };

    const stateOf = (answerId: string): AnswerState => {
        if (!isFinished) {
            return answerId === given ? "picked" : "idle";
        }
        if (given === undefined) {
            return "neutral";
        }
        if (answerId === question.goodAnswer) {
            return "correct";
        }
        return answerId === given ? "wrong" : "neutral";
    };

    return (
        <main className="page">
            <QuestionCard title={<>EGZAMIN: {isFinished ? "--:--" : formatTime(timeLeft)}</>}
                          position={index + 1}
                          total={questions.length}
                          question={question}
                          disabled={isFinished}
                          stateOf={stateOf}
                          isMarked={answerId => answerId === given}
                          onPick={answerId => setAnswers({...answers, [index]: answerId})}/>

            <QuestionNav onPrevious={() => setIndex(index - 1)}
                         previousDisabled={index === 0}
                         onNext={() => setIndex(index + 1)}
                         nextDisabled={index === questions.length - 1 || (!isFinished && given === undefined)}
                         center={isFinished
                             ? {icon: <HomeIcon/>, label: "Strona główna", onClick: () => navigate("/activity-page")}
                             : {icon: <RuleIcon/>, label: "Zakończ egzamin", onClick: finish}}/>

            <AppModal open={isSummaryOpen} onClose={() => setIsSummaryOpen(false)}>
                <p>UKOŃCZONO EGZAMIN</p>
                <img src={goodAnswers >= EXAM.goodAnswersToPass ? passed : failed} alt=""/>
                <p className="result result--good">DOBRZE: {goodAnswers}</p>
                <p className="result result--bad">ŹLE: {questions.length - goodAnswers}</p>
                <MenuButton onClick={() => setIsSummaryOpen(false)}>PRZEGLĄDAJ</MenuButton>
            </AppModal>
        </main>
    );
}

export default ExamPage;
