import {fireEvent, screen} from "@testing-library/react";
import LearnPage from "./learn-page";
import ExamPage from "./exam-page";
import {AnswerState, Question} from "../model";
import {clearProgress, loadProgress, saveProgress} from "../services/db";
import {getQuestionsByCategory, loadExamQuestions} from "../services/question-service";
import {
    ANSWER_IDS,
    answerButton,
    answerLetter,
    answerStates,
    flushPromises,
    headerTitle,
    modalImageSource,
    modalText,
    nextButton,
    position,
    previousButton,
    questionText,
    renderRoute,
    seededRandom,
    textOf,
} from "../test-utils";

// Random clicking checked step by step against a minimal reference model of the expected behaviour.
// Clicks on disabled buttons are deliberate: they must not change anything.

jest.mock("../services/db");
jest.mock("../services/question-service", () => ({
    ...jest.requireActual("../services/question-service"),
    loadExamQuestions: jest.fn(),
}));

const mockLoad = loadProgress as jest.MockedFunction<typeof loadProgress>;
const mockSave = saveProgress as jest.MockedFunction<typeof saveProgress>;
const mockClear = clearProgress as jest.MockedFunction<typeof clearProgress>;
const mockLoadExam = loadExamQuestions as jest.MockedFunction<typeof loadExamQuestions>;

const SEEDS = Array.from({length: 8}, (_, i) => i + 1);
const STEPS = 250;

let consoleError: jest.SpyInstance;

beforeEach(() => {
    mockLoad.mockResolvedValue(null);
    mockSave.mockResolvedValue();
    mockClear.mockResolvedValue();
    consoleError = jest.spyOn(console, "error");
});

afterEach(() => {
    expect(consoleError).not.toHaveBeenCalled();
});

type Weighted<T extends string> = [T, number][];

function chooser<T extends string>(random: () => number, weights: Weighted<T>) {
    const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
    return (): T => {
        let roll = random() * total;
        for (const [action, weight] of weights) {
            roll -= weight;
            if (roll < 0) {
                return action;
            }
        }
        return weights[weights.length - 1][0];
    };
}

const randomOf = <T, >(random: () => number, items: T[]) => items[Math.floor(random() * items.length)];

function withReplayInfo(seed: number, step: number, history: string[], check: () => void) {
    try {
        check();
    } catch (error) {
        (error as Error).message =
            `seed ${seed}, step ${step}, last actions: ${history.slice(-15).join(" → ")}\n\n${(error as Error).message}`;
        throw error;
    }
}

describe("learning mode monkey", () => {
    type LearnAction = "pickGood" | "pickWrong" | "pickAny" | "next" | "previous";

    interface LearnModel {
        index: number;
        solved: Set<number>;
        picked?: string;
        wrong: boolean;
        moduleDone: boolean;
        saves: number;
    }

    const CASES: [string, boolean][] = [
        ["obrona_konieczna_i_stan_wyzszej_koniecznosci", false],
        ["przewozenie_broni_srodkami_transportu_publicznego", false],
        ["przechowywanie_i_noszenie_broni", false],
        ["sankcje_karne", false],
        ["sankcje_karne", true],
    ];

    function expectedState(model: LearnModel, question: Question, id: string): AnswerState {
        if (model.solved.has(question.id)) {
            return id === question.goodAnswer ? "correct" : "idle";
        }
        if (id !== model.picked) {
            return "idle";
        }
        return model.wrong ? "wrong" : "picked";
    }

    function expectScreenMatches(model: LearnModel, questions: Question[]) {
        const question = questions[model.index];
        const isSolved = model.solved.has(question.id);
        expect(position()).toBe(`${model.index + 1}/${questions.length}`);
        expect(questionText()).toBe(textOf(question));
        expect(answerStates()).toEqual(Object.fromEntries(ANSWER_IDS.map(id => [id, expectedState(model, question, id)])));
        ANSWER_IDS.forEach(id => {
            expect(answerButton(id)).toHaveProperty("disabled", isSolved);
            expect(answerLetter(id)).not.toHaveClass("answer__letter--marked");
        });
        expect(previousButton()).toHaveProperty("disabled", model.index === 0);
        expect(nextButton()).toHaveProperty("disabled", isSolved && model.index === questions.length - 1);
    }

    // In random mode the order is only known after rendering, so each question is identified from the screen.
    function questionOnScreen(pool: Question[]) {
        return pool.find(question => textOf(question) === questionText() &&
            question.possibleAnswer.every(answer => answerButton(answer.id).textContent === answer.value))!;
    }

    async function runLearn(seed: number, slug: string, random: boolean) {
        const pool = getQuestionsByCategory(slug, false);
        renderRoute(`/nauka/${slug}${random ? "?random=true" : ""}`, "/nauka/:category", <LearnPage/>);
        await flushPromises();

        const rng = seededRandom(seed);
        const nextAction = chooser<LearnAction>(rng, [["pickGood", 25], ["pickWrong", 15], ["pickAny", 10], ["next", 30], ["previous", 20]]);
        const model: LearnModel = {index: 0, solved: new Set(), wrong: false, moduleDone: false, saves: 0};
        const order: (Question | undefined)[] = random ? Array(pool.length).fill(undefined) : [...pool];
        const history: string[] = [];
        let completions = 0;

        const current = () => {
            order[model.index] ??= questionOnScreen(pool);
            return order[model.index]!;
        };

        const resetPick = () => {
            model.picked = undefined;
            model.wrong = false;
        };

        for (let step = 0; step < STEPS; step++) {
            const action = nextAction();
            const question = current();
            const isSolved = model.solved.has(question.id);
            const isLast = model.index === pool.length - 1;

            if (action === "next") {
                history.push("next");
                fireEvent.click(nextButton());
                if (isSolved) {
                    if (!isLast) {
                        model.index++;
                        resetPick();
                    }
                } else if (model.picked !== undefined) {
                    if (model.picked !== question.goodAnswer) {
                        model.wrong = true;
                    } else {
                        model.solved.add(question.id);
                        model.saves++;
                        if (isLast) {
                            model.moduleDone = true;
                        } else {
                            model.index++;
                            resetPick();
                        }
                    }
                }
            } else if (action === "previous") {
                history.push("previous");
                fireEvent.click(previousButton());
                if (model.index > 0) {
                    model.index--;
                    resetPick();
                }
            } else {
                const wrongIds = ANSWER_IDS.filter(id => id !== question.goodAnswer);
                const id = action === "pickGood" ? question.goodAnswer
                    : action === "pickWrong" ? randomOf(rng, wrongIds)
                        : randomOf(rng, ANSWER_IDS);
                history.push(`pick ${id}${id === question.goodAnswer ? " (good)" : ""}`);
                fireEvent.click(answerButton(id));
                if (!isSolved) {
                    model.picked = id;
                    model.wrong = false;
                }
            }

            const wasDone = model.moduleDone;
            withReplayInfo(seed, step, history, () => {
                const modalOpen = modalText()?.includes("UKOŃCZONO MODUŁ") ?? false;
                expect(modalOpen).toBe(wasDone);
                if (modalOpen) {
                    fireEvent.click(screen.getByText("ZAMKNIJ"));
                    expect(modalText()).toBeNull();
                }
            });
            if (wasDone) {
                model.moduleDone = false;
                completions++;
            }
            withReplayInfo(seed, step, history, () => {
                current();
                expectScreenMatches(model, order as Question[]);
            });
        }

        expect(mockSave).toHaveBeenCalledTimes(model.saves);
        mockSave.mock.calls.forEach(([savedCategory, savedRandom, progress]) => {
            expect(savedCategory).toBe(slug);
            expect(savedRandom).toBe(random);
            expect([...progress.questionIds].sort()).toEqual(pool.map(q => q.id).sort());
        });
        if (model.saves > 0) {
            expect(mockSave.mock.calls[model.saves - 1][2].solvedIds).toEqual(Array.from(model.solved));
        }
        return {completions, solved: model.solved.size};
    }

    describe.each(CASES)("%s (random: %s)", (slug, random) => {
        const results: { completions: number; solved: number }[] = [];

        test.each(SEEDS)("seed %i", async seed => {
            results.push(await runLearn(seed, slug, random));
        });

        // Guards against the monkey silently degrading into clicking around the first question.
        test("at least one run solved the whole module", () => {
            expect(results.some(result => result.completions > 0)).toBe(true);
        });
    });
});

describe("exam monkey", () => {
    type ExamAction = "pick" | "next" | "previous" | "finish";

    interface ExamModel {
        index: number;
        answers: Record<number, string>;
        finished: boolean;
    }

    const QUESTIONS = getQuestionsByCategory("WSZYSTKIE", false).filter((_, i) => i % 9 === 4).slice(0, 20);
    const goodCount = (model: ExamModel) => QUESTIONS.filter((question, i) => model.answers[i] === question.goodAnswer).length;

    function expectedState(model: ExamModel, question: Question, given: string | undefined, id: string): AnswerState {
        if (!model.finished) {
            return id === given ? "picked" : "idle";
        }
        if (given === undefined) {
            return "neutral";
        }
        if (id === question.goodAnswer) {
            return "correct";
        }
        return id === given ? "wrong" : "neutral";
    }

    function expectScreenMatches(model: ExamModel) {
        const question = QUESTIONS[model.index];
        const given = model.answers[model.index];
        expect(position()).toBe(`${model.index + 1}/20`);
        expect(questionText()).toBe(textOf(question));
        expect(answerStates()).toEqual(Object.fromEntries(ANSWER_IDS.map(id => [id, expectedState(model, question, given, id)])));
        ANSWER_IDS.forEach(id => {
            expect(answerButton(id)).toHaveProperty("disabled", model.finished);
            expect(answerLetter(id).classList.contains("answer__letter--marked")).toBe(id === given);
        });
        expect(previousButton()).toHaveProperty("disabled", model.index === 0);
        expect(nextButton()).toHaveProperty("disabled", model.index === 19 || (!model.finished && given === undefined));
        if (model.finished) {
            expect(headerTitle()).toBe("EGZAMIN: --:--");
        } else {
            expect(headerTitle()).toMatch(/^EGZAMIN: \d+ min: \d{2}$/);
        }
    }

    function expectSummary(model: ExamModel) {
        const good = goodCount(model);
        expect(screen.getByText(`DOBRZE: ${good}`)).toBeInTheDocument();
        expect(screen.getByText(`ŹLE: ${20 - good}`)).toBeInTheDocument();
        expect(modalImageSource()).toBe(good >= 18 ? "passed.gif" : "failed.gif");
        fireEvent.click(screen.getByText("PRZEGLĄDAJ"));
        expect(screen.queryByText("UKOŃCZONO EGZAMIN")).not.toBeInTheDocument();
    }

    const runs: { reachedLast: boolean; finishedEarly: boolean }[] = [];

    test.each(SEEDS)("seed %i", seed => {
        mockLoadExam.mockReturnValue(QUESTIONS);
        renderRoute("/exam-page", "/exam-page", <ExamPage/>);

        const rng = seededRandom(seed);
        // Finishing is rare so most runs explore deep into the exam before switching to review mode.
        const nextAction = chooser<ExamAction>(rng, [["pick", 35], ["next", 35], ["previous", 28], ["finish", 1]]);
        const model: ExamModel = {index: 0, answers: {}, finished: false};
        const history: string[] = [];
        const run = {reachedLast: false, finishedEarly: false};
        runs.push(run);

        for (let step = 0; step < STEPS; step++) {
            const action = nextAction();
            const given = model.answers[model.index];
            run.reachedLast ||= model.index === 19;

            if (action === "pick") {
                const id = randomOf(rng, ANSWER_IDS);
                history.push(`pick ${id}`);
                fireEvent.click(answerButton(id));
                if (!model.finished) {
                    model.answers = {...model.answers, [model.index]: id};
                }
            } else if (action === "next") {
                history.push("next");
                fireEvent.click(nextButton());
                if (model.index < 19 && (model.finished || given !== undefined)) {
                    model.index++;
                }
            } else if (action === "previous") {
                history.push("previous");
                fireEvent.click(previousButton());
                if (model.index > 0) {
                    model.index--;
                }
            } else if (!model.finished) {
                history.push("finish");
                fireEvent.click(screen.getByLabelText("Zakończ egzamin"));
                model.finished = true;
                run.finishedEarly = true;
                withReplayInfo(seed, step, history, () => expectSummary(model));
            }

            withReplayInfo(seed, step, history, () => expectScreenMatches(model));
        }

        if (!model.finished) {
            fireEvent.click(screen.getByLabelText("Zakończ egzamin"));
            model.finished = true;
            withReplayInfo(seed, STEPS, history, () => {
                expectSummary(model);
                expectScreenMatches(model);
            });
        }
    });

    test("runs covered both the last question and reviewing after an early finish", () => {
        expect(runs.some(run => run.reachedLast)).toBe(true);
        expect(runs.some(run => run.finishedEarly)).toBe(true);
    });
});
