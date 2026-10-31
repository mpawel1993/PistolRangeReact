import {fireEvent, screen} from "@testing-library/react";
import LearnPage from "./learn-page";
import {clearProgress, loadProgress, saveProgress} from "../services/db";
import {getQuestionsByCategory} from "../services/question-service";
import {
    ANSWER_IDS,
    answerButton,
    answerLetter,
    answerStates,
    flushPromises,
    headerTitle,
    nextButton,
    otherWrongAnswerOf,
    position,
    previousButton,
    questionText,
    renderRoute,
    statesWith,
    textOf,
    wrongAnswerOf,
} from "../test-utils";

jest.mock("../services/db");

const mockLoad = loadProgress as jest.MockedFunction<typeof loadProgress>;
const mockSave = saveProgress as jest.MockedFunction<typeof saveProgress>;
const mockClear = clearProgress as jest.MockedFunction<typeof clearProgress>;

const SANKCJE = getQuestionsByCategory("SANKCJE_KARNE", false);
const OBRONA = getQuestionsByCategory("OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI", false);
const ids = (questions: { id: number }[]) => questions.map(question => question.id);

beforeEach(() => {
    mockLoad.mockResolvedValue(null);
    mockSave.mockResolvedValue();
    mockClear.mockResolvedValue();
});

async function renderLearn(url = "/nauka/sankcje_karne") {
    renderRoute(url, "/nauka/:category", <LearnPage/>);
    await flushPromises();
}

const pick = (id: string) => fireEvent.click(answerButton(id));
const next = () => fireEvent.click(nextButton());
const previous = () => fireEvent.click(previousButton());

function solve(question: { goodAnswer: string }) {
    pick(question.goodAnswer);
    next();
}

function expectUnsolvedQuestion(index: number, questions = SANKCJE) {
    expect(position()).toBe(`${index + 1}/${questions.length}`);
    expect(questionText()).toBe(textOf(questions[index]));
    ANSWER_IDS.forEach(id => expect(answerButton(id)).toBeEnabled());
}

function expectSolvedQuestion(index: number, questions = SANKCJE) {
    const question = questions[index];
    expect(position()).toBe(`${index + 1}/${questions.length}`);
    expect(questionText()).toBe(textOf(question));
    expect(answerStates()).toEqual(statesWith({[question.goodAnswer]: "correct"}));
    ANSWER_IDS.forEach(id => expect(answerButton(id)).toBeDisabled());
}

describe("initial state", () => {
    test("shows the first question of the category with every answer neutral", async () => {
        await renderLearn();

        expectUnsolvedQuestion(0);
        expect(headerTitle()).toBe("SANKCJE KARNE");
        expect(answerStates()).toEqual(statesWith({}));
        SANKCJE[0].possibleAnswer.forEach(answer => expect(answerButton(answer.id)).toHaveTextContent(answer.value));
        expect(previousButton()).toBeDisabled();
        expect(nextButton()).toBeEnabled();
        expect(mockLoad).toHaveBeenCalledWith("sankcje_karne", false);
    });

    test("never underlines answer letters in learning mode", async () => {
        await renderLearn();
        pick("a");
        ANSWER_IDS.forEach(id => expect(answerLetter(id)).not.toHaveClass("answer__letter--marked"));
    });
});

describe("picking and checking answers", () => {
    test("picking marks only that answer yellow", async () => {
        await renderLearn();
        ANSWER_IDS.forEach(id => {
            pick(id);
            expect(answerStates()).toEqual(statesWith({[id]: "picked"}));
        });
    });

    test("next without a picked answer does nothing", async () => {
        await renderLearn();
        next();
        next();
        expectUnsolvedQuestion(0);
        expect(answerStates()).toEqual(statesWith({}));
        expect(mockSave).not.toHaveBeenCalled();
    });

    test("a wrong answer turns red only on the picked answer and keeps the question", async () => {
        await renderLearn();
        const wrong = wrongAnswerOf(SANKCJE[0]);
        pick(wrong);
        next();

        expectUnsolvedQuestion(0);
        expect(answerStates()).toEqual(statesWith({[wrong]: "wrong"}));
        expect(answerStates()[SANKCJE[0].goodAnswer]).toBe("idle");
        expect(mockSave).not.toHaveBeenCalled();
    });

    test("pressing next again on a red answer keeps it red and saves nothing", async () => {
        await renderLearn();
        const wrong = wrongAnswerOf(SANKCJE[0]);
        pick(wrong);
        next();
        next();
        next();
        expectUnsolvedQuestion(0);
        expect(answerStates()).toEqual(statesWith({[wrong]: "wrong"}));
        expect(mockSave).not.toHaveBeenCalled();
    });

    test("picking again after a wrong answer clears the red", async () => {
        await renderLearn();
        const wrong = wrongAnswerOf(SANKCJE[0]);
        pick(wrong);
        next();

        pick(wrong);
        expect(answerStates()).toEqual(statesWith({[wrong]: "picked"}));

        const otherWrong = otherWrongAnswerOf(SANKCJE[0]);
        pick(otherWrong);
        next();
        expect(answerStates()).toEqual(statesWith({[otherWrong]: "wrong"}));
    });

    test("the correct answer advances to the next question and saves progress", async () => {
        await renderLearn();
        solve(SANKCJE[0]);

        expectUnsolvedQuestion(1);
        expect(answerStates()).toEqual(statesWith({}));
        expect(previousButton()).toBeEnabled();
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith("sankcje_karne", false, {
            questionIds: ids(SANKCJE),
            solvedIds: [SANKCJE[0].id],
        });
    });

    test("wrong first, then correct still solves the question", async () => {
        await renderLearn();
        pick(wrongAnswerOf(SANKCJE[0]));
        next();
        solve(SANKCJE[0]);

        expectUnsolvedQuestion(1);
        expect(mockSave).toHaveBeenLastCalledWith("sankcje_karne", false, {
            questionIds: ids(SANKCJE),
            solvedIds: [SANKCJE[0].id],
        });
    });

    test("progress accumulates across questions", async () => {
        await renderLearn();
        SANKCJE.slice(0, 4).forEach(solve);

        expectUnsolvedQuestion(4);
        expect(mockSave).toHaveBeenCalledTimes(4);
        expect(mockSave).toHaveBeenLastCalledWith("sankcje_karne", false, {
            questionIds: ids(SANKCJE),
            solvedIds: ids(SANKCJE.slice(0, 4)),
        });
    });
});

describe("navigation", () => {
    test("a solved question shows green on the good answer and is locked when revisited", async () => {
        await renderLearn();
        solve(SANKCJE[0]);
        previous();

        expectSolvedQuestion(0);
        expect(previousButton()).toBeDisabled();

        pick(wrongAnswerOf(SANKCJE[0]));
        expectSolvedQuestion(0);
    });

    test("next moves past a solved question without saving again", async () => {
        await renderLearn();
        solve(SANKCJE[0]);
        previous();
        next();

        expectUnsolvedQuestion(1);
        expect(answerStates()).toEqual(statesWith({}));
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    test("an unconfirmed pick is dropped when leaving the question", async () => {
        await renderLearn();
        solve(SANKCJE[0]);
        pick(wrongAnswerOf(SANKCJE[1]));
        previous();
        next();

        expectUnsolvedQuestion(1);
        expect(answerStates()).toEqual(statesWith({}));
    });

    test("a red answer is cleared when leaving the question", async () => {
        await renderLearn();
        solve(SANKCJE[0]);
        pick(wrongAnswerOf(SANKCJE[1]));
        next();
        previous();
        next();

        expect(answerStates()).toEqual(statesWith({}));
    });

    test("can walk back to the first question and forward again over solved ones", async () => {
        await renderLearn();
        SANKCJE.slice(0, 3).forEach(solve);

        for (let index = 2; index >= 0; index--) {
            previous();
            expectSolvedQuestion(index);
        }
        for (let index = 1; index <= 2; index++) {
            next();
            expectSolvedQuestion(index);
        }
        next();
        expectUnsolvedQuestion(3);
    });

    test("home button leads to the activity page", async () => {
        await renderLearn();
        fireEvent.click(screen.getByLabelText("Strona główna"));
        expect(screen.getByText("ACTIVITY_PAGE")).toBeInTheDocument();
    });

    test("an unknown category redirects to the category list", async () => {
        await renderLearn("/nauka/nie_istnieje");
        expect(screen.getByText("SET_OF_QUESTIONS_PAGE")).toBeInTheDocument();
    });
});

describe("finishing a module", () => {
    test("solving the last question shows the completion modal and locks the module", async () => {
        await renderLearn("/nauka/obrona_konieczna_i_stan_wyzszej_koniecznosci");
        solve(OBRONA[0]);
        solve(OBRONA[1]);
        expect(screen.queryByText("UKOŃCZONO MODUŁ")).not.toBeInTheDocument();
        solve(OBRONA[2]);

        expect(screen.getByText("UKOŃCZONO MODUŁ")).toBeInTheDocument();
        fireEvent.click(screen.getByText("ZAMKNIJ"));
        expect(screen.queryByText("UKOŃCZONO MODUŁ")).not.toBeInTheDocument();

        expectSolvedQuestion(2, OBRONA);
        expect(nextButton()).toBeDisabled();
        expect(previousButton()).toBeEnabled();
        expect(mockSave).toHaveBeenCalledTimes(3);
        expect(mockSave).toHaveBeenLastCalledWith("obrona_konieczna_i_stan_wyzszej_koniecznosci", false, {
            questionIds: ids(OBRONA),
            solvedIds: ids(OBRONA),
        });
    });

    test("a wrong answer on the last question does not finish the module", async () => {
        await renderLearn("/nauka/obrona_konieczna_i_stan_wyzszej_koniecznosci");
        solve(OBRONA[0]);
        solve(OBRONA[1]);
        pick(wrongAnswerOf(OBRONA[2]));
        next();

        expect(screen.queryByText("UKOŃCZONO MODUŁ")).not.toBeInTheDocument();
        expect(answerStates()).toEqual(statesWith({[wrongAnswerOf(OBRONA[2])]: "wrong"}));
        expect(nextButton()).toBeEnabled();
    });

    test("next is enabled on the last question until it is solved", async () => {
        await renderLearn("/nauka/obrona_konieczna_i_stan_wyzszej_koniecznosci");
        solve(OBRONA[0]);
        solve(OBRONA[1]);
        expect(position()).toBe("3/3");
        expect(nextButton()).toBeEnabled();
    });
});

describe("random mode", () => {
    test("uses a permutation of the category and its own progress key", async () => {
        await renderLearn("/nauka/sankcje_karne?random=true");
        expect(mockLoad).toHaveBeenCalledWith("sankcje_karne", true);

        const first = SANKCJE.find(question => textOf(question) === questionText() &&
            question.possibleAnswer.every(answer => answerButton(answer.id).textContent === answer.value))!;
        solve(first);

        const [category, random, progress] = mockSave.mock.calls[0];
        expect(category).toBe("sankcje_karne");
        expect(random).toBe(true);
        expect([...progress.questionIds].sort()).toEqual([...ids(SANKCJE)].sort());
        expect(progress.questionIds[0]).toBe(first.id);
        expect(progress.solvedIds).toEqual([first.id]);
    });
});

describe("saved progress", () => {
    const reversed = [...SANKCJE].reverse();

    test("does not ask when nothing was solved before", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(SANKCJE), solvedIds: []});
        await renderLearn();
        expect(screen.queryByText("OD NOWA?")).not.toBeInTheDocument();
    });

    test("asks to start over and shows the stored progress", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(reversed), solvedIds: ids(reversed.slice(0, 2))});
        await renderLearn();
        expect(await screen.findByText("OD NOWA?")).toBeInTheDocument();
        expect(screen.getByText("Poprzedni progres: (2/13)")).toBeInTheDocument();
    });

    test("'Nie' restores the stored order and continues at the first unsolved question", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(reversed), solvedIds: ids(reversed.slice(0, 2))});
        await renderLearn();
        fireEvent.click(await screen.findByText("Nie"));

        expect(screen.queryByText("OD NOWA?")).not.toBeInTheDocument();
        expectUnsolvedQuestion(2, reversed);
        expect(answerStates()).toEqual(statesWith({}));
        previous();
        expectSolvedQuestion(1, reversed);
        previous();
        expectSolvedQuestion(0, reversed);
        expect(mockClear).not.toHaveBeenCalled();
    });

    test("continuing keeps saving into the restored order", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(reversed), solvedIds: ids(reversed.slice(0, 2))});
        await renderLearn();
        fireEvent.click(await screen.findByText("Nie"));
        solve(reversed[2]);

        expect(mockSave).toHaveBeenLastCalledWith("sankcje_karne", false, {
            questionIds: ids(reversed),
            solvedIds: ids(reversed.slice(0, 3)),
        });
    });

    test("'Nie' on a fully solved module lands on the last question", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(OBRONA), solvedIds: ids(OBRONA)});
        await renderLearn("/nauka/obrona_konieczna_i_stan_wyzszej_koniecznosci");
        fireEvent.click(await screen.findByText("Nie"));

        expectSolvedQuestion(2, OBRONA);
        expect(nextButton()).toBeDisabled();
    });

    test("'Nie' ignores ids of questions that no longer exist", async () => {
        mockLoad.mockResolvedValue({questionIds: [-1, ...ids(SANKCJE)], solvedIds: [-1, SANKCJE[0].id]});
        await renderLearn();
        fireEvent.click(await screen.findByText("Nie"));
        expectUnsolvedQuestion(1);
    });

    test("'Tak' clears the stored progress and starts from scratch", async () => {
        mockLoad.mockResolvedValue({questionIds: ids(reversed), solvedIds: ids(reversed.slice(0, 2))});
        await renderLearn();
        fireEvent.click(await screen.findByText("Tak"));

        expect(screen.queryByText("OD NOWA?")).not.toBeInTheDocument();
        expect(mockClear).toHaveBeenCalledWith("sankcje_karne", false);
        expectUnsolvedQuestion(0);
        expect(answerStates()).toEqual(statesWith({}));
        expect(previousButton()).toBeDisabled();
    });
});
