export interface Answer {
    id: string;
    value: string;
}

export interface Question {
    id: number;
    value: string;
    paragraph: string;
    goodAnswer: string;
    category: string;
    possibleAnswer: Answer[];
}

export type AnswerState = "idle" | "picked" | "correct" | "wrong" | "neutral";

export const ALL_CATEGORIES = "WSZYSTKIE";

export const CATEGORIES = [
    "USTAWA_O_BRONI_I_AMUNICJI",
    "PRZECHOWYWANIE_I_NOSZENIE_BRONI",
    "PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO",
    "BEZPIECZENSTWO_NA_STRZELNICACH",
    "SANKCJE_KARNE",
    "OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI",
];
