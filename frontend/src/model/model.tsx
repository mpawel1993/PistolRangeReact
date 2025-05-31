export interface Question {
    displayId: number;
    value: string;
    paragraph: string;
    possibleAnswer: PossibleAnswer[];
    goodAnswer: string;
    actualAnswer: string | undefined;
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

export interface LearnPageParams {
    questions: Question[],
    categoryName: string,
    storageKey: string
}

export interface ExamDetails{
    examDuration: number,
    goodAnswersToPass: number,
    answersCount: number,
}

export const WeaponLawCategory = Object.freeze({
    WSZYSTKIE: "WSZYSTKIE",
    USTAWA_O_BRONI_I_AMUNICJI: "USTAWA_O_BRONI_I_AMUNICJI",
    PRZECHOWYWANIE_I_NOSZENIE_BRONI: "PRZECHOWYWANIE_I_NOSZENIE_BRONI",
    PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO: "PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO",
    BEZPIECZENSTWO_NA_STRZELNICACH: "BEZPIECZENSTWO_NA_STRZELNICACH",
    SANKCJE_KARNE: "SANKCJE_KARNE",
    OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI: "OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI"
});
