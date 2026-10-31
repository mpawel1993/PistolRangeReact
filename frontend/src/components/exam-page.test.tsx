import {act, fireEvent, screen} from "@testing-library/react";
import ExamPage from "./exam-page";
import {Question} from "../model";
import {getQuestionsByCategory, loadExamQuestions} from "../services/question-service";
import {
    ANSWER_IDS,
    answerButton,
    answerLetter,
    answerStates,
    headerTitle,
    modalImageSource,
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

jest.mock("../services/question-service", () => ({
    ...jest.requireActual("../services/question-service"),
    loadExamQuestions: jest.fn(),
}));

const mockLoadExam = loadExamQuestions as jest.MockedFunction<typeof loadExamQuestions>;

// Fixed question set instead of a random draw, so every expectation is exact.
const QUESTIONS: Question[] = getQuestionsByCategory("WSZYSTKIE", false).filter((_, i) => i % 10 === 3).slice(0, 20);

beforeEach(() => {
    mockLoadExam.mockReturnValue(QUESTIONS);
});

afterEach(() => {
    jest.useRealTimers();
});

const renderExam = () => renderRoute("/exam-page", "/exam-page", <ExamPage/>);
const pick = (id: string) => fireEvent.click(answerButton(id));
const next = () => fireEvent.click(nextButton());
const previous = () => fireEvent.click(previousButton());
const finish = () => fireEvent.click(screen.getByLabelText("Zakończ egzamin"));
const closeSummary = () => fireEvent.click(screen.getByText("PRZEGLĄDAJ"));

function expectQuestion(index: number) {
    expect(position()).toBe(`${index + 1}/20`);
    expect(questionText()).toBe(textOf(QUESTIONS[index]));
}

function markedLetters() {
    return ANSWER_IDS.filter(id => answerLetter(id).classList.contains("answer__letter--marked"));
}

// Answers the first `count` questions, correctly for the first `correct` of them, and stays on the last answered one.
function answerQuestions(count: number, correct: number) {
    for (let index = 0; index < count; index++) {
        pick(index < correct ? QUESTIONS[index].goodAnswer : wrongAnswerOf(QUESTIONS[index]));
        if (index < count - 1) {
            next();
        }
    }
}

describe("during the exam", () => {
    test("starts on question 1 of 20 with a full timer and nothing picked", () => {
        renderExam();
        expectQuestion(0);
        expect(headerTitle()).toBe("EGZAMIN: 30 min: 00");
        expect(answerStates()).toEqual(statesWith({}));
        expect(markedLetters()).toEqual([]);
        ANSWER_IDS.forEach(id => expect(answerButton(id)).toBeEnabled());
        expect(previousButton()).toBeDisabled();
        expect(nextButton()).toBeDisabled();
    });

    test("picking marks the answer yellow and underlines its letter, without revealing correctness", () => {
        renderExam();
        ANSWER_IDS.forEach(id => {
            pick(id);
            expect(answerStates()).toEqual(statesWith({[id]: "picked"}));
            expect(markedLetters()).toEqual([id]);
        });
    });

    test("next is enabled only once the question is answered", () => {
        renderExam();
        next();
        expectQuestion(0);
        pick("b");
        expect(nextButton()).toBeEnabled();
        next();
        expectQuestion(1);
        expect(answerStates()).toEqual(statesWith({}));
        expect(nextButton()).toBeDisabled();
        expect(previousButton()).toBeEnabled();
    });

    test("answers are remembered per question while moving back and forth", () => {
        renderExam();
        pick("c");
        next();
        pick("a");
        previous();

        expectQuestion(0);
        expect(answerStates()).toEqual(statesWith({c: "picked"}));
        expect(markedLetters()).toEqual(["c"]);
        expect(nextButton()).toBeEnabled();

        pick("b");
        next();
        expectQuestion(1);
        expect(answerStates()).toEqual(statesWith({a: "picked"}));
        previous();
        expect(answerStates()).toEqual(statesWith({b: "picked"}));
    });

    test("cannot move past question 20", () => {
        renderExam();
        answerQuestions(20, 20);
        expectQuestion(19);
        expect(nextButton()).toBeDisabled();
        next();
        expectQuestion(19);
    });

    test("the timer counts down every second", () => {
        jest.useFakeTimers();
        renderExam();
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(headerTitle()).toBe("EGZAMIN: 29 min: 59");
        act(() => {
            jest.advanceTimersByTime(9 * 60 * 1000 - 1000);
        });
        expect(headerTitle()).toBe("EGZAMIN: 21 min: 00");
    });
});

describe("summary and review", () => {
    test("finishing grades the exam: correct green, wrong red, the rest grey", () => {
        renderExam();
        pick(QUESTIONS[0].goodAnswer);
        next();
        pick(wrongAnswerOf(QUESTIONS[1]));
        next();
        pick(QUESTIONS[2].goodAnswer);
        finish();

        expect(screen.getByText("UKOŃCZONO EGZAMIN")).toBeInTheDocument();
        expect(screen.getByText("DOBRZE: 2")).toBeInTheDocument();
        expect(screen.getByText("ŹLE: 18")).toBeInTheDocument();
        closeSummary();
        expect(screen.queryByText("UKOŃCZONO EGZAMIN")).not.toBeInTheDocument();

        expect(headerTitle()).toBe("EGZAMIN: --:--");
        expect(screen.getByLabelText("Strona główna")).toBeInTheDocument();
        expect(screen.queryByLabelText("Zakończ egzamin")).not.toBeInTheDocument();

        expectQuestion(2);
        expect(answerStates()).toEqual(statesWith({[QUESTIONS[2].goodAnswer]: "correct"}, "neutral"));
        expect(markedLetters()).toEqual([QUESTIONS[2].goodAnswer]);

        previous();
        const wrong = wrongAnswerOf(QUESTIONS[1]);
        expect(answerStates()).toEqual(statesWith({[wrong]: "wrong", [QUESTIONS[1].goodAnswer]: "correct"}, "neutral"));
        expect(markedLetters()).toEqual([wrong]);

        previous();
        expect(answerStates()).toEqual(statesWith({[QUESTIONS[0].goodAnswer]: "correct"}, "neutral"));
    });

    test("unanswered questions are all grey and can be browsed after finishing", () => {
        renderExam();
        finish();
        closeSummary();

        for (let index = 0; index < 20; index++) {
            expectQuestion(index);
            expect(answerStates()).toEqual(statesWith({}, "neutral"));
            expect(markedLetters()).toEqual([]);
            expect(nextButton()).toHaveProperty("disabled", index === 19);
            next();
        }
    });

    test("answers are locked after finishing", () => {
        renderExam();
        pick(wrongAnswerOf(QUESTIONS[0]));
        finish();
        closeSummary();

        ANSWER_IDS.forEach(id => expect(answerButton(id)).toBeDisabled());
        pick(QUESTIONS[0].goodAnswer);
        pick(otherWrongAnswerOf(QUESTIONS[0]));
        expect(answerStates()[wrongAnswerOf(QUESTIONS[0])]).toBe("wrong");
        expect(answerStates()[QUESTIONS[0].goodAnswer]).toBe("correct");
    });

    test("18 correct answers pass", () => {
        renderExam();
        answerQuestions(20, 18);
        finish();
        expect(screen.getByText("DOBRZE: 18")).toBeInTheDocument();
        expect(screen.getByText("ŹLE: 2")).toBeInTheDocument();
        expect(modalImageSource()).toBe("passed.gif");
    });

    test("17 correct answers fail", () => {
        renderExam();
        answerQuestions(20, 17);
        finish();
        expect(screen.getByText("DOBRZE: 17")).toBeInTheDocument();
        expect(screen.getByText("ŹLE: 3")).toBeInTheDocument();
        expect(modalImageSource()).toBe("failed.gif");
    });

    test("20 correct answers pass", () => {
        renderExam();
        answerQuestions(20, 20);
        finish();
        expect(screen.getByText("DOBRZE: 20")).toBeInTheDocument();
        expect(screen.getByText("ŹLE: 0")).toBeInTheDocument();
        expect(modalImageSource()).toBe("passed.gif");
    });

    test("changing an answer before finishing counts only the final choice", () => {
        renderExam();
        pick(wrongAnswerOf(QUESTIONS[0]));
        pick(QUESTIONS[0].goodAnswer);
        next();
        pick(QUESTIONS[1].goodAnswer);
        pick(wrongAnswerOf(QUESTIONS[1]));
        finish();
        expect(screen.getByText("DOBRZE: 1")).toBeInTheDocument();
    });

    test("running out of time ends the exam and grades it", () => {
        jest.useFakeTimers();
        renderExam();
        pick(QUESTIONS[0].goodAnswer);
        act(() => {
            jest.advanceTimersByTime(30 * 60 * 1000);
        });

        expect(screen.getByText("UKOŃCZONO EGZAMIN")).toBeInTheDocument();
        expect(screen.getByText("DOBRZE: 1")).toBeInTheDocument();
        closeSummary();
        expect(headerTitle()).toBe("EGZAMIN: --:--");
        ANSWER_IDS.forEach(id => expect(answerButton(id)).toBeDisabled());

        act(() => {
            jest.advanceTimersByTime(60 * 1000);
        });
        expect(screen.queryByText("UKOŃCZONO EGZAMIN")).not.toBeInTheDocument();
    });

    test("finishing early stops the timer", () => {
        jest.useFakeTimers();
        renderExam();
        finish();
        closeSummary();
        act(() => {
            jest.advanceTimersByTime(31 * 60 * 1000);
        });
        expect(screen.queryByText("UKOŃCZONO EGZAMIN")).not.toBeInTheDocument();
        expect(headerTitle()).toBe("EGZAMIN: --:--");
    });

    test("home button after finishing leads to the activity page", () => {
        renderExam();
        finish();
        closeSummary();
        fireEvent.click(screen.getByLabelText("Strona główna"));
        expect(screen.getByText("ACTIVITY_PAGE")).toBeInTheDocument();
    });
});
