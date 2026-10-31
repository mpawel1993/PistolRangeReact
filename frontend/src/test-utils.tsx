import {ReactElement} from "react";
import {act, render} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {AnswerState, Question} from "./model";

export const ANSWER_IDS = ["a", "b", "c"];

export function renderRoute(url: string, routePath: string, element: ReactElement) {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <Routes>
                <Route path={routePath} element={element}/>
                <Route path="/set-of-questions" element={<div>SET_OF_QUESTIONS_PAGE</div>}/>
                <Route path="/activity-page" element={<div>ACTIVITY_PAGE</div>}/>
            </Routes>
        </MemoryRouter>
    );
}

export const answerButton = (id: string): HTMLButtonElement => {
    const letter = Array.from(document.querySelectorAll(".answer__letter"))
        .find(element => element.textContent === id.toUpperCase());
    if (!letter?.parentElement) {
        throw new Error(`No answer ${id} on screen`);
    }
    return letter.parentElement.querySelector("button") as HTMLButtonElement;
};

export const answerLetter = (id: string) => answerButton(id).parentElement!.querySelector(".answer__letter")!;

export const answerStates = (): Record<string, AnswerState> =>
    Object.fromEntries(ANSWER_IDS.map(id => [id, answerButton(id).dataset.state as AnswerState]));

export const position = () => document.querySelector(".question-header__badge span")!.textContent;
export const headerTitle = () => document.querySelector(".question-header__title")!.textContent;
export const questionText = () => document.querySelector(".question-text")!.textContent;
export const textOf = (question: Question) => `${question.value} ${question.paragraph}`;

// Direct selectors instead of getByLabelText: these run thousands of times in the monkey tests.
const byLabel = (label: string) => {
    const element = document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
    if (!element) {
        throw new Error(`No element labelled "${label}"`);
    }
    return element;
};

export const nextButton = () => byLabel("Następne pytanie");
export const previousButton = () => byLabel("Poprzednie pytanie");
export const modalText = () => document.querySelector(".modal")?.textContent ?? null;
export const modalImageSource = () => document.querySelector(".modal img")?.getAttribute("src");

// Lets pending promises (e.g. the mocked progress load) settle inside act().
export const flushPromises = () => act(async () => {
});

export const wrongAnswerOf = (question: Question) => ANSWER_IDS.find(id => id !== question.goodAnswer)!;
export const otherWrongAnswerOf = (question: Question) => ANSWER_IDS.filter(id => id !== question.goodAnswer)[1];

export const statesWith = (overrides: Record<string, AnswerState>, base: AnswerState = "idle") =>
    Object.fromEntries(ANSWER_IDS.map(id => [id, overrides[id] ?? base]));

// Small deterministic PRNG so a failing monkey run can be replayed from its seed.
export function seededRandom(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
