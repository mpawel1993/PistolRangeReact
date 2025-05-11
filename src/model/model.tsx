export interface Question {
    id: number;
    value: string;
    paragraph: string;
    possibleAnswer: PossibleAnswer[];
    goodAnswer: string;
    actualAnswer: string;
    isButtonsDisabled: boolean;
}

export interface PossibleAnswer {
    id: string;
    value: string;
    gradient: any;
    isPicked: boolean;
}

export interface StorageObject {
    questions: Question[];
    actualQuestion: Question;
}