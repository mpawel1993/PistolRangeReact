import {ExamDetails, PossibleAnswer, Question} from "./model";

export const initQuestion = {
    displayId: 1,
    isButtonsDisabled: true,
    value: '', possibleAnswer:
        [{id: 'a', value: '', gradient: ['white', 'white']} as PossibleAnswer,
            {id: 'b', value: '', gradient: ['white', 'white']} as PossibleAnswer,
            {id: 'c', value: '', gradient: ['white', 'white']} as PossibleAnswer]
} as Question

export const initExamDetails = {
    examDuration: 0,
    goodAnswersToPass: 0,
    answersCount: 0,
} as ExamDetails