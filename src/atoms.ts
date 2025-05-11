import { atom } from 'jotai';
import {Question} from "./model/model";

export const allQuestionsAtom = atom([] as Question[]);