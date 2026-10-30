import {useEffect, useState} from "react";
import {Navigate, useNavigate, useParams, useSearchParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import QuestionCard from "./question-card";
import QuestionNav from "./question-nav";
import AppModal from "./app-modal";
import MenuButton from "./menu-button";
import passed from "../assets/passed.gif";
import {AnswerState} from "../model";
import {formatCategory} from "../utils";
import {getQuestionsByCategory, getQuestionsByIds} from "../services/question-service";
import {clearProgress, LearnProgress, loadProgress, saveProgress} from "../services/db";

export const LearnPage = () => {
    const {category = ""} = useParams();
    const [searchParams] = useSearchParams();
    const random = searchParams.get("random") === "true";

    return <LearnSession key={`${category}:${random}`} category={category.toLowerCase()} random={random}/>;
}

const LearnSession = ({category, random}: { category: string, random: boolean }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState(() => getQuestionsByCategory(category, random));
    const [solved, setSolved] = useState<Set<number>>(new Set());
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<string>();
    const [isWrong, setIsWrong] = useState(false);
    const [savedProgress, setSavedProgress] = useState<LearnProgress | null>(null);
    const [isModuleDone, setIsModuleDone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadProgress(category, random)
            .then(progress => {
                if (!cancelled && progress && progress.solvedIds.length > 0) {
                    setSavedProgress(progress);
                }
            })
            .catch(console.error);
        return () => {
            cancelled = true;
        };
    }, [category, random]);

    const question = questions[index];
    if (!question) {
        return <Navigate to="/set-of-questions" replace/>;
    }

    const isSolved = solved.has(question.id);
    const isLast = index === questions.length - 1;

    const goTo = (target: number) => {
        setIndex(target);
        setPicked(undefined);
        setIsWrong(false);
    };

    const resume = () => {
        if (savedProgress) {
            const restored = getQuestionsByIds(savedProgress.questionIds);
            if (restored.length > 0) {
                const restoredSolved = new Set(savedProgress.solvedIds);
                const firstUnsolved = restored.findIndex(q => !restoredSolved.has(q.id));
                setQuestions(restored);
                setSolved(restoredSolved);
                goTo(firstUnsolved === -1 ? restored.length - 1 : firstUnsolved);
            }
        }
        setSavedProgress(null);
    };

    const startOver = () => {
        setSavedProgress(null);
        clearProgress(category, random).catch(console.error);
    };

    const handlePick = (answerId: string) => {
        setPicked(answerId);
        setIsWrong(false);
    };

    const handleNext = () => {
        if (isSolved) {
            if (!isLast) {
                goTo(index + 1);
            }
            return;
        }
        if (picked === undefined) {
            return;
        }
        if (picked !== question.goodAnswer) {
            setIsWrong(true);
            return;
        }
        const nextSolved = new Set(solved).add(question.id);
        setSolved(nextSolved);
        saveProgress(category, random, {questionIds: questions.map(q => q.id), solvedIds: Array.from(nextSolved)})
            .catch(console.error);
        if (isLast) {
            setIsModuleDone(true);
        } else {
            goTo(index + 1);
        }
    };

    const stateOf = (answerId: string): AnswerState => {
        if (isSolved) {
            return answerId === question.goodAnswer ? "correct" : "idle";
        }
        if (answerId !== picked) {
            return "idle";
        }
        return isWrong ? "wrong" : "picked";
    };

    return (
        <main className="page">
            <QuestionCard title={formatCategory(category)}
                          position={index + 1}
                          total={questions.length}
                          question={question}
                          disabled={isSolved}
                          stateOf={stateOf}
                          onPick={handlePick}/>

            <QuestionNav onPrevious={() => goTo(index - 1)}
                         previousDisabled={index === 0}
                         onNext={handleNext}
                         nextDisabled={isSolved && isLast}
                         center={{icon: <HomeIcon/>, label: "Strona główna", onClick: () => navigate("/activity-page")}}/>

            <AppModal open={savedProgress !== null}>
                <p>OD NOWA?</p>
                <p>Poprzedni progres: ({savedProgress?.solvedIds.length}/{savedProgress?.questionIds.length})</p>
                <MenuButton onClick={startOver}>Tak</MenuButton>
                <MenuButton onClick={resume}>Nie</MenuButton>
            </AppModal>

            <AppModal open={isModuleDone} onClose={() => setIsModuleDone(false)}>
                <p>UKOŃCZONO MODUŁ</p>
                <img src={passed} alt=""/>
                <MenuButton onClick={() => setIsModuleDone(false)}>ZAMKNIJ</MenuButton>
            </AppModal>
        </main>
    );
}

export default LearnPage;
