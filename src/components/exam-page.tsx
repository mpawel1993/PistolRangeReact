import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {PossibleAnswer, Question} from "../model/model";

export const ExamPage = () => {
    const location = useLocation();
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
            // navigation.navigate('ActivityPage');
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

    return (<div style={{color:'red'}}>EXAM</div>)
}

export default ExamPage;