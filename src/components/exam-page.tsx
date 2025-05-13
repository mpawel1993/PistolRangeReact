import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useNavigation} from "react-router-dom";
import {PossibleAnswer, Question} from "../model/model";
import AnswerField from "./answerField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RuleIcon from '@mui/icons-material/Rule';
import ExamSummary from "./exam-summary";
import HomeIcon from "@mui/icons-material/Home";

export const ExamPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState(location.state);

    const [questions, setQuestions] = useState([] as Question[]); //Filtered questions list
    const [time, setTime] = useState(1800 || 10);
    const [formattedTime, setFormattedTime] = useState('30min: 0 sec');
    const timerRef = useRef(time);
    let isQuestionsLoaded = false;
    const [actualQuestion, setActualQuestion] = useState({//Actual Loaded Questions
        id: 1,
        value: '', possibleAnswer:
            [{id: 'a', value: '', gradient: ['white', 'white']} as PossibleAnswer,
                {id: 'b', value: '', gradient: ['white', 'white']} as PossibleAnswer,
                {id: 'c', value: '', gradient: ['white', 'white']} as PossibleAnswer]
    } as Question);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [previousDisabled, setPreviousButtonDisabled] = useState(false);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [wasSummaryDisplayed, setWasSummaryDisplayed] = useState(false);
    const [goodAnswers, setGoodAnswers] = useState(0);
    const [isExamSummarised, setIsExamSummarised] = useState(false);

    useEffect(() => {
        let que = params.questions.map((x:any) => Object.assign({}, x));
        que.map((a:any) => {
            a.possibleAnswer.map((b:any) => b.gradient = ['#94c02b', '#71912a']);
        });
        setQuestions(que);
    }, [params]);

    useEffect(() => {
        if (questions.length !== 0 && !isQuestionsLoaded) {
            let que = questions.map(x => Object.assign({}, x));
            que.map(a => {
                a.possibleAnswer.map(b => b.gradient = ['#94c02b', '#71912a']);
            });
            const question = questions.filter(x => x.id == 1)[0];
            setActualQuestion(question);
            isQuestionsLoaded = true;
        }
    }, [questions]);

    useEffect(() => {
        if (actualQuestion.id == 1) {
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(true);
        } else if (actualQuestion.id <= 1) {
            setActualQuestion(questions.filter(x => x.id == 1)[0])
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(true);
        } else if (actualQuestion.id >= questions.length) {
            setActualQuestion(questions.filter(x => x.id == questions.length)[0]);
        } else {
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(false);
        }
    }, [actualQuestion]);

    useEffect(() => {
        const timerId = setInterval(() => {
            timerRef.current -= 1;
            if (timerRef.current < 0) {
                clearInterval(timerId);
            } else {
                setTime(timerRef.current);
                setFormattedTime(secondsToHms(timerRef.current));
            }
            if (timerRef.current < 0 && !isExamSummarised) {
                handleQuit();
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, []);

    function secondsToHms(d: number) {
        d = Number(d);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        var mDisplay = m > 0 ? m + (m == 1 ? " min : " : " min : ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
        return mDisplay + sDisplay;
    }

    const handleQuit = () => {
        summaryExam();
        setIsSummaryVisible(true);
        setWasSummaryDisplayed(true);
        if (wasSummaryDisplayed) {
            navigate('/activity-page')
        }
    }

    const handlePickUp = (option: string) => {
        let question = actualQuestion;
        // @ts-ignore
        question.actualAnswer = undefined;
        question.possibleAnswer.map(x => x.gradient = ['#94c02b', '#71912a']);
        // @ts-ignore
        setActualQuestion({...actualQuestion, question});
        question.possibleAnswer.filter(x => x.id == option)[0].gradient = ['#ffff2b', '#ffff2a'];
        question.actualAnswer = option;
        // @ts-ignore
        setActualQuestion({...actualQuestion, question});
        questions[actualQuestion.id - 1].actualAnswer = option;
        setQuestions(questions);
    }

    const handleNextQuestion = () => {
        let question = actualQuestion;
        if (actualQuestion.actualAnswer !== undefined) {
            let nextId = JSON.parse(JSON.stringify(question.id));
            nextId++;
            let next = questions.filter(x => x.id == nextId)[0];
            if (nextId === questions.length) {
                setNextButtonDisabled(true);
            } else {
                setPreviousButtonDisabled(false);
            }
            setActualQuestion(next);
        }
    }

    const handlePreviousQuestion = () => {
        const question = JSON.parse(JSON.stringify(actualQuestion));
        let prevId = JSON.parse(JSON.stringify(question.id));
        prevId--;
        let previous = questions.filter(x => x.id == prevId)[0];
        if (prevId === questions.length) {
            setNextButtonDisabled(true);
        } else {
            setPreviousButtonDisabled(false);
        }
        setActualQuestion(previous);
    }

    const colorGrey = (question: Question) => {
        question.possibleAnswer.filter(x => x.id == 'a')[0].gradient = ['#6e736e' , '#a1a6a1'];
        question.possibleAnswer.filter(x => x.id == 'b')[0].gradient = ['#6e736e' , '#a1a6a1'];
        question.possibleAnswer.filter(x => x.id == 'c')[0].gradient = ['#6e736e' , '#a1a6a1'];
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
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908' , '#28a628'];
                    // @ts-ignore
                    setActualQuestion({...actualQuestion, question});
                    goodAnswers++;
                } else {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000' , '#740000'];
                    question.possibleAnswer.filter(x => x.id == question.goodAnswer)[0].gradient = ['#085908' , '#28a628'];
                    // @ts-ignore
                    setActualQuestion({...actualQuestion, question});
                }
            } else {
                colorGrey(question);
            }
            setGoodAnswers(goodAnswers);
        });
        setQuestions(questions);
        setIsExamSummarised(true);
    }

    return (<div>
        <br/>
        {isExamSummarised ? <ExamSummary goodCount={goodAnswers} /> : <div/>}

        <div style={{color: '#98c135'}}>{!isExamSummarised ? formattedTime : '--:--'}</div>

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
                         isPicked={false}/>
        </div>
        <div onClick={() => handlePickUp('b')}>
            <AnswerField disabled={actualQuestion.isButtonsDisabled}
                         gradientColours={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].gradient}
                         option={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].id}
                         possibleAnswer={actualQuestion.possibleAnswer.filter(x => x.id === 'b')[0].value}
                         isPicked={false}/>
        </div>

        <div onClick={() => handlePickUp('c')}>
            <AnswerField disabled={actualQuestion.isButtonsDisabled}
                         gradientColours={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].gradient}
                         option={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].id}
                         possibleAnswer={actualQuestion.possibleAnswer.filter(x => x.id === 'c')[0].value}
                         isPicked={false}/>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
            <button style={navButtonStyle}
                    onClick={() => handlePreviousQuestion()} disabled={previousDisabled}>
                <ArrowBackIcon />
            </button>
            {!wasSummaryDisplayed ? <button style={navButtonStyle} onClick={() => handleQuit()}>
                    <RuleIcon/>
                </button> :
                <button style={navButtonStyle} onClick={() => handleQuit()}>
                    <HomeIcon/>
                </button>}
            <button style={navButtonStyle} onClick={() => handleNextQuestion()} disabled={nextButtonDisabled}>
                <ArrowForwardIcon />
            </button>
        </div>

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