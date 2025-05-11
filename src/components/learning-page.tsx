import {SetStateAction, useEffect, useState} from "react";
import {PossibleAnswer, Question, StorageObject} from "../model/model";
import {useLocation} from "react-router-dom";

export const LearningPage = () => {
    const location = useLocation();

    const [params, setParams] = useState(location.state);
    let [isQuestionsLoaded, setIsQuestionLoaded] = useState(false);
    const [category, setCategory] = useState('');
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [questions, setQuestions] = useState([] as Question[]); //Filtered questions list
    const [actualQuestion, setActualQuestion] = useState({//Actual Loaded Questions
        id: 1,
        value: '', possibleAnswer:
            [{id: 'a', value: '', gradient: ['white', 'white']} as PossibleAnswer,
                {id: 'b', value: '', gradient: ['white', 'white']} as PossibleAnswer,
                {id: 'c', value: '', gradient: ['white', 'white']} as PossibleAnswer]
    } as Question);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [previousDisabled, setPreviousButtonDisabled] = useState(false);
    const [storageKey, setStorageKey] = useState('');
    const [isStorageItemsExist, setIsStorageItemsExist] = useState(false);
    const [userResponse, setUserResponse] = useState('yes');

    //After Component Mount
    useEffect(() => {
        let que = params.questions.map((x :any) => Object.assign({}, x));
        que.map((a:any) => {
            a.possibleAnswer.map((b:any) => b.gradient = ['#94c02b', '#71912a']);
        });
        setQuestions(que);
        setCategory(params.categoryName);
        setStorageKey(params.storageKey);
    }, [params]);

    useEffect(() => {
        if (questions.length !== 0 && !isQuestionsLoaded) {
            let que = questions.map(x => Object.assign({}, x));
            que.map(a => {
                a.possibleAnswer.map(b => b.gradient = ['#94c02b', '#71912a']);
            });
            const question = questions.filter(x => x.id == 1)[0];
            setActualQuestion(question);
            setIsQuestionLoaded(true);
        } else {
            if (questions.length !== 0) {
                const question = questions.filter(x => x.actualAnswer == undefined)[0];
                setActualQuestion(question);
                setIsQuestionLoaded(true);
            }
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
            setPreviousButtonDisabled(false);
            setActualQuestion(questions.filter(x => x.id == questions.length)[0])
        } else {
            setNextButtonDisabled(false);
            setPreviousButtonDisabled(false);
        }
    }, [actualQuestion]);

    const handleQuit = () => {
        // navigation.navigate('ActivityPage');
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
            let next = questions.filter(x => x.id == nextId)[0]
            if (next === undefined) {
                if (question.actualAnswer === question.goodAnswer) {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908', '#28a628'];
                    setIsSummaryVisible(true);
                    questions[question.id - 1].isButtonsDisabled = true
                    setQuestions(questions);
                } else {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000', '#740000'];
                    // @ts-ignore
                    setActualQuestion({...actualQuestion, question});
                }
            } else {
                if (!question.isButtonsDisabled) {
                    const id = question.id;
                    if (id === questions.length) {
                        setNextButtonDisabled(true);
                    } else {
                        setPreviousButtonDisabled(false);
                    }
                    if (question.actualAnswer === question.goodAnswer) {
                        question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908', '#28a628'];
                        questions[id - 1].isButtonsDisabled = true
                        setQuestions(questions);
                        setActualQuestion(next);
                        storeData();
                    } else {
                        question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000', '#740000'];
                        setActualQuestion(question);
                    }
                } else {
                    setActualQuestion(next);
                }
            }
        }
    }

    const handlePreviousQuestion = () => {
        const id = actualQuestion.id;
        let prevId = JSON.parse(JSON.stringify(id));
        prevId--;
        let previous = questions.filter(x => x.id == prevId)[0]
        if (id === questions.length) {
            setNextButtonDisabled(true);
        } else {
            setPreviousButtonDisabled(false);
        }
        setActualQuestion(previous);
    }

    useEffect(() => {
        if (userResponse === 'no') {
            readAsyncData();
        }
    }, [userResponse]);

    useEffect(() => {
        if (storageKey != '') {
            checkAsyncData();
        }
    }, [storageKey]);

    const sendData = (data: SetStateAction<string>) => {
        setUserResponse(data)
    }

    const storeData = () => {
        if (storageKey != '') {
            try {
                let tmpQuestions = JSON.parse(JSON.stringify(questions));
                let forSave = {
                    questions: tmpQuestions, actualQuestion: actualQuestion
                } as StorageObject;
                localStorage.setItem(storageKey, JSON.stringify(forSave));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const checkAsyncData = () => {
        try {
            const item = localStorage.getItem(storageKey);
            if (item !== null) {
                setIsStorageItemsExist(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const readAsyncData = () => {
        try {
            const item = localStorage.getItem(storageKey);
            if (item !== null) {
                let parsed = JSON.parse(item) as StorageObject;
                setQuestions(parsed.questions);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (<div>{actualQuestion.value}{actualQuestion.paragraph} {category}</div>);
}

export default LearningPage;