import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ExamDetails, Question} from "../model/model";
import AnswerField from "./answerField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RuleIcon from '@mui/icons-material/Rule';
import HomeIcon from "@mui/icons-material/Home";
import banger from "../assets/badger.png";
import {initQuestion} from "../model/init-data";
import ExamSummary from "./exam-summary";
import {examDetailsAtom, goodAnswersCounterAtom, isExamSummaryVisibleAtom} from "../atoms/app-atoms";
import {useSetAtom} from "jotai";
import {getExamDetails, loadQuestionsForExam} from "../services/question-service";

export const ExamPage = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([] as Question[]);
    const [actualQuestion, setActualQuestion] = useState(initQuestion);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [previousDisabled, setPreviousButtonDisabled] = useState(false);
    const [wasSummaryDisplayed, setWasSummaryDisplayed] = useState(false);
    const [isExamSummarised, setIsExamSummarised] = useState(false);
    const [isQuestionsLoaded, setIsQuestionLoaded] = useState(false);
    const setIsSummaryOpen = useSetAtom(isExamSummaryVisibleAtom);
    const setGoodAnswers = useSetAtom(goodAnswersCounterAtom);
    const setExamDetails = useSetAtom(examDetailsAtom);
    const [time, setTime] = useState(-1);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        setQuestions(loadQuestionsForExam());

        const examDetails: ExamDetails = getExamDetails();
        setTime(examDetails.examDuration);
        setIsTimerRunning(true);
        setExamDetails(examDetails);
    }, []);

    useEffect(() => {
        if (questions.length !== 0 && !isQuestionsLoaded) {
            let que = questions.map(x => Object.assign({}, x));
            que.map(a => {
                a.possibleAnswer.map(b => b.gradient = ['#94c02b', '#71912a']);
            });
            const question = questions.filter(x => x.displayId == 1)[0];
            setActualQuestion(question);
            setIsQuestionLoaded(true)
        }
    }, [questions]);

    useEffect(() => {
        if (actualQuestion.displayId == 1) {
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(true);
        } else if (actualQuestion.displayId <= 1) {
            setActualQuestion(questions.filter(x => x.displayId == 1)[0])
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(true);
        } else if (actualQuestion.displayId >= questions.length) {
            setPreviousButtonDisabled(false);
            setActualQuestion(questions.filter(x => x.displayId == questions.length)[0])
        } else {
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(false);
        }
    }, [actualQuestion]);

    useEffect(() => {
        if (!isTimerRunning) return;
        if (time === -1) return;
        if (isExamSummarised) return;
        const interval = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerRunning, time]);

    useEffect(() => {
        if (time !== -1) {
            if (time === 0) {
                setIsTimerRunning(false);
                summaryExam();
            }
        }
    }, [time]);

    const handleQuit = () => {
        summaryExam();
        setIsSummaryOpen(true);
        setWasSummaryDisplayed(true);
        if (wasSummaryDisplayed) {
            navigate('/activity-page')
        }
    }

    const handlePickUp = (option: string) => {
        if (!actualQuestion.isButtonsDisabled) {
            actualQuestion.actualAnswer = undefined;
            actualQuestion.possibleAnswer.map(x => {
                x.gradient = ['#94c02b', '#71912a'];
                x.isPicked = false;
            });
            actualQuestion.possibleAnswer.filter(x => x.id == option)[0].gradient = ['#ffff2b', '#ffff2a'];
            actualQuestion.possibleAnswer.filter(x => x.id == option)[0].isPicked = true;
            actualQuestion.actualAnswer = option;
            setActualQuestion({...actualQuestion});
        }
    }

    const handleNextQuestion = () => {
        if (actualQuestion.actualAnswer !== undefined) {
            let nextId = JSON.parse(JSON.stringify(actualQuestion.displayId));
            nextId++;
            let next = questions.filter(x => x.displayId == nextId)[0];
            next.possibleAnswer.map(x => {
                if (x.gradient == undefined) {
                    x.gradient = ['#94c02b', '#71912a']
                }
            });
            if (nextId === questions.length) {
                setNextButtonDisabled(true);
            } else {
                setPreviousButtonDisabled(false);
            }
            setActualQuestion(next);
        }
    }

    const handlePreviousQuestion = () => {
        const id = actualQuestion.displayId;
        let prevId = JSON.parse(JSON.stringify(id));
        prevId--;
        let previous = questions.filter(x => x.displayId == prevId)[0]
        if (id === questions.length) {
            setNextButtonDisabled(true);
        } else {
            setPreviousButtonDisabled(false);
        }
        setActualQuestion(previous);
    }

    const colorGrey = (question: Question) => {
        question.possibleAnswer.filter(x => x.id == 'a')[0].gradient = ['#6e736e', '#a1a6a1'];
        question.possibleAnswer.filter(x => x.id == 'b')[0].gradient = ['#6e736e', '#a1a6a1'];
        question.possibleAnswer.filter(x => x.id == 'c')[0].gradient = ['#6e736e', '#a1a6a1'];
    }

    const summaryExam = () => {
        let goodAnswers = 0;

        questions.map(a => {
            a.isButtonsDisabled = true;
        });

        questions.map(question => {
            if (question.actualAnswer !== undefined) {
                colorGrey(question);
                question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].isPicked = true;

                if (question.actualAnswer === question.goodAnswer) {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908', '#28a628'];
                    setActualQuestion(question);
                    goodAnswers++;
                } else {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000', '#740000'];
                    question.possibleAnswer.filter(x => x.id == question.goodAnswer)[0].gradient = ['#085908', '#28a628'];
                    setActualQuestion(question);
                }
            } else {
                colorGrey(question);
            }
            setGoodAnswers(goodAnswers);
        });
        setQuestions(questions);
        setIsExamSummarised(true);
        setIsSummaryOpen(true);
    }

    return (<div>
        <br/>
        <div style={{display: "flex", background: "linear-gradient(to right, #94c02b, #71912a)"}}>
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
                <div>
                    <img style={{
                        width: '50%',
                        height: 'auto'
                    }} src={banger} alt="Logo"/>
                </div>

                <div style={{
                    color: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '50%'
                }}>
                    {actualQuestion.displayId}/{questions.length}
                </div>
            </div>
            <div style={{color: 'black', width: '100%'}}>
                <p>EGZAMIN
                    : {!isExamSummarised ? <>{Math.floor(time / 60)} min: {time % 60 < 10 ? `0${time % 60}` : time % 60}</> : '--:--'}</p>
            </div>
        </div>

        <div style={{color: '#98c135'}}></div>

        <div style={{color: '#98c135'}}>
            <br/>
            {actualQuestion.value}{actualQuestion.paragraph}
        </div>
        <br/>

        <div onClick={() => handlePickUp('a')}>
            <AnswerField disabled={actualQuestion.isButtonsDisabled}
                         gradientColours={actualQuestion.possibleAnswer.filter(x => x.id === 'a')[0].gradient}
                         option={actualQuestion.possibleAnswer.filter(x => x.id === 'a')[0].id}
                         possibleAnswer={actualQuestion.possibleAnswer.filter(x => x.id === 'a')[0].value}
                         isPicked={actualQuestion.possibleAnswer.filter(x => x.id === 'a')[0].isPicked}/>
        </div>
        <div onClick={() => handlePickUp('b')}>
            <AnswerField disabled={actualQuestion.isButtonsDisabled}
                         gradientColours={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].gradient}
                         option={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].id}
                         possibleAnswer={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].value}
                         isPicked={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].isPicked}/>
        </div>

        <div onClick={() => handlePickUp('c')}>
            <AnswerField disabled={actualQuestion.isButtonsDisabled}
                         gradientColours={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].gradient}
                         option={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].id}
                         possibleAnswer={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].value}
                         isPicked={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].isPicked}/>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
            <button style={navButtonStyle}
                    onClick={() => handlePreviousQuestion()} disabled={previousDisabled}>
                <ArrowBackIcon/>
            </button>
            {!wasSummaryDisplayed ? <button style={navButtonStyle} onClick={() => handleQuit()}>
                    <RuleIcon/>
                </button> :
                <button style={navButtonStyle} onClick={() => handleQuit()}>
                    <HomeIcon/>
                </button>}
            <button style={navButtonStyle} onClick={() => handleNextQuestion()} disabled={nextButtonDisabled}>
                <ArrowForwardIcon/>
            </button>
        </div>

        <ExamSummary/>
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

export default ExamPage;