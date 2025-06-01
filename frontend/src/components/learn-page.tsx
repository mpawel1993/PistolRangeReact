import {SetStateAction, useCallback, useEffect, useState} from "react";
import {PossibleAnswer, Question, StorageObject} from "../model/model";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AnswerField from "./answerField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import banger from "../assets/badger.png"
import {initQuestion} from "../model/init-data";
import {useAtomValue, useSetAtom} from "jotai";
import {
    fromBeginUserResponseAtom,
    isFromBeginModalVisibleAtom,
    isModuleSummaryVisibleAtom,
} from "../atoms/app-atoms";
import EndOfModuleModal from "./end-of-module-modal";
import {replaceUnderscoreWithSpace} from "../utils";
import FromBeginModal from "./from-begin-modal";

export const LearnPage = () => {
    const {param} = useParams();
    const navigate = useNavigate();
    const [isQuestionsLoaded, setIsQuestionLoaded] = useState(false);
    const [questions, setQuestions] = useState([] as Question[]);
    const [actualQuestion, setActualQuestion] = useState(initQuestion);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [previousDisabled, setPreviousButtonDisabled] = useState(false);
    const [storageKey, setStorageKey] = useState('');
    const [isStorageItemsExist, setIsStorageItemsExist] = useState(false);
    const setIsSummaryVisible = useSetAtom(isModuleSummaryVisibleAtom);
    const setIsFromBeginModalVisible = useSetAtom(isFromBeginModalVisibleAtom);
    const fromBeginUserResponse = useAtomValue(fromBeginUserResponseAtom);

    useEffect(() => {
        setStorageKey(param as string);
        checkLocalStorageData();

        const randomQuestionsStorage = localStorage.getItem('pistol_range_random_questions');
        const randomQuestions = randomQuestionsStorage ? randomQuestionsStorage : 'false';

        fetch(`/learn/category/${param}/${randomQuestions}`)
            .then((response) => response.json())
            .then((result) => setQuestions(result))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (isStorageItemsExist) {
            setIsFromBeginModalVisible(true);
        }
    }, [isStorageItemsExist]);

    useEffect(() => {
        if (questions.length !== 0 && !isQuestionsLoaded) {
            let que = questions.map(x => Object.assign({}, x));
            que.map(a => {
                a.possibleAnswer.map(b => b.gradient = ['#94c02b', '#71912a']);
            });
            const question = questions.filter(x => x.displayId == 1)[0];
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

    const handleQuit = () => {
        navigate('/activity-page');
    }

    const handlePickUp = (option: string) => {
        if (!actualQuestion.isButtonsDisabled) {
            actualQuestion.actualAnswer = undefined;
            actualQuestion.possibleAnswer.map(x => x.gradient = ['#94c02b', '#71912a']);
            setActualQuestion({...actualQuestion});
            actualQuestion.possibleAnswer.filter(x => x.id == option)[0].gradient = ['#ffff2b', '#ffff2a'];
            actualQuestion.actualAnswer = option;
            setActualQuestion({...actualQuestion});
        }
    }

    const handleNextQuestion = () => {
        let question = actualQuestion;
        if (actualQuestion.actualAnswer !== undefined) {
            let nextId = JSON.parse(JSON.stringify(question.displayId));
            nextId++;
            let next = questions.filter(x => x.displayId == nextId)[0]
            if (next === undefined) {
                if (question.actualAnswer === question.goodAnswer) {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908', '#28a628'];
                    setIsSummaryVisible(true);
                    setActualQuestion({...question});
                    questions[question.displayId - 1].isButtonsDisabled = true
                    setQuestions(questions);
                } else {
                    question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000', '#740000'];
                    setActualQuestion({...question});
                }
            } else {
                if (!question.isButtonsDisabled) {
                    const id = question.displayId;
                    if (id === questions.length) {
                        setNextButtonDisabled(true);
                    } else {
                        setPreviousButtonDisabled(false);
                    }
                    if (question.actualAnswer === question.goodAnswer) {
                        question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#085908', '#28a628'];
                        questions[id - 1].isButtonsDisabled = true
                        setQuestions(questions);
                        next.possibleAnswer.map(x => x.gradient = ['#94c02b', '#71912a']);
                        setActualQuestion(next);
                        storeData();
                    } else {
                        question.possibleAnswer.filter(x => x.id == question.actualAnswer)[0].gradient = ['#500000', '#740000'];
                        setActualQuestion({...question});
                    }
                } else {
                    setActualQuestion(next);
                }
            }
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

    useEffect(() => {
        if (!fromBeginUserResponse) {
            readLocalStorageData();
        }
    }, [fromBeginUserResponse]);

    useEffect(() => {
        if (storageKey != '') {
            checkLocalStorageData();
        }
    }, [storageKey]);

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

    const checkLocalStorageData = () => {
        try {
            const item = localStorage.getItem(storageKey);
            if (item !== null) {
                setIsStorageItemsExist(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const readLocalStorageData = () => {
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

    return (<div>
        <EndOfModuleModal/>
        <FromBeginModal/>

        <div style={{display: "flex", background: "linear-gradient(to right, #94c02b, #71912a)", flex:1}}>
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
                <div>
                    <img style={{
                        width: '70%',
                        height: 'auto'
                    }} src={banger} alt="Logo"/>
                </div>

                <div style={{
                    color: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '70%'
                }}>
                    {actualQuestion.displayId}/{questions.length}
                </div>
            </div>
            <div style={{color: 'black', width: '90%',
                display:'inline-block',
                textAlign:'center',
            }}>
                {replaceUnderscoreWithSpace(param ? param : '').toUpperCase()}
            </div>
        </div>

        <div style={{color: '#98c135'}}>
            {actualQuestion.value}{actualQuestion.paragraph}
        </div>

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
                <ArrowBackIcon/>
            </button>
            <button style={navButtonStyle} onClick={() => handleQuit()}>
                <HomeIcon/>
            </button>
            <button style={navButtonStyle} onClick={() => handleNextQuestion()} disabled={nextButtonDisabled}>
                <ArrowForwardIcon/>
            </button>
        </div>
    </div>);
}

const navButtonStyle = {
    color: 'black',
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

export default LearnPage;