import { atom } from 'jotai';
import {Question} from "./model/model";

export const allQuestionsAtom = atom([] as Question[]);

export const  categories = ['WSZYSTKIE', 'USTAWA O BRONI I AMUNICJI', 'PRZECHOWYWANIE I NOSZENIE BRONI',
    'PRZEWOŻENIE BRONI ŚRODKAMI TRANSPORTU PUBLICZNEGO', 'BEZPIECZENSTWO NA STRZELNICACH', 'SANKCJE KARNE',
    'OBRONA KONIECZNA I STAN WYŻSZEJ KONIECZNOŚCI'];