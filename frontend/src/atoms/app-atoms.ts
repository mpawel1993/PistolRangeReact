import {atom} from "jotai";
import {initExamDetails} from "../model/init-data";

export const isExamSummaryVisibleAtom = atom(false);
export const isModuleSummaryVisibleAtom = atom(false);
export const goodAnswersCounterAtom = atom(0);
export const examDetailsAtom = atom(initExamDetails);