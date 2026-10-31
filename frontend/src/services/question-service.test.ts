import questionsData from "../assets/questions.json";
import {ALL_CATEGORIES, CATEGORIES} from "../model";
import {EXAM, getQuestionsByCategory, getQuestionsByIds, loadExamQuestions} from "./question-service";

const ALL = getQuestionsByCategory(ALL_CATEGORIES, false);
const ids = (questions: { id: number }[]) => questions.map(question => question.id);
const sorted = (values: number[]) => [...values].sort((a, b) => a - b);

describe("question bank integrity", () => {
    test("contains every question from the data file exactly once", () => {
        expect(ALL).toHaveLength(questionsData.length);
        expect(new Set(ids(ALL)).size).toBe(ALL.length);
        expect(ids(ALL)).toEqual(questionsData.map(question => question.legacyId));
    });

    test.each(ALL.map(question => [question.id, question]))("question %i is well-formed", (_, question) => {
        expect(question.value.trim()).not.toBe("");
        expect(question.possibleAnswer.map(answer => answer.id)).toEqual(["a", "b", "c"]);
        question.possibleAnswer.forEach(answer => expect(answer.value.trim()).not.toBe(""));
        expect(["a", "b", "c"]).toContain(question.goodAnswer);
        expect(CATEGORIES).toContain(question.category);
    });

    test("every category has questions and together they cover the whole bank", () => {
        const counts = CATEGORIES.map(category => getQuestionsByCategory(category, false).length);
        counts.forEach(count => expect(count).toBeGreaterThan(0));
        expect(counts.reduce((sum, count) => sum + count, 0)).toBe(ALL.length);
    });
});

describe("getQuestionsByCategory", () => {
    test("keeps data order in non-random mode and filters by category", () => {
        const sankcje = getQuestionsByCategory("SANKCJE_KARNE", false);
        expect(ids(sankcje)).toEqual(ids(ALL.filter(question => question.category === "SANKCJE_KARNE")));
    });

    test("is case-insensitive, as URLs use lower case", () => {
        expect(getQuestionsByCategory("sankcje_karne", false)).toEqual(getQuestionsByCategory("SANKCJE_KARNE", false));
        expect(getQuestionsByCategory("wszystkie", false)).toHaveLength(ALL.length);
    });

    test("returns nothing for an unknown category", () => {
        expect(getQuestionsByCategory("nie_istnieje", false)).toEqual([]);
    });

    test("random mode returns a permutation of the same questions", () => {
        const ordered = getQuestionsByCategory("USTAWA_O_BRONI_I_AMUNICJI", false);
        const shuffled = getQuestionsByCategory("USTAWA_O_BRONI_I_AMUNICJI", true);
        expect(sorted(ids(shuffled))).toEqual(sorted(ids(ordered)));
        expect(ids(shuffled)).not.toEqual(ids(ordered));
    });

    test("shuffling does not reorder the shared question bank", () => {
        getQuestionsByCategory(ALL_CATEGORIES, true);
        expect(ids(getQuestionsByCategory(ALL_CATEGORIES, false))).toEqual(ids(ALL));
    });
});

describe("loadExamQuestions", () => {
    test("uses the official exam settings", () => {
        expect(EXAM).toEqual({durationSeconds: 1800, questionCount: 20, goodAnswersToPass: 18});
    });

    test("draws 20 distinct questions from the bank", () => {
        for (let run = 0; run < 50; run++) {
            const exam = loadExamQuestions();
            expect(exam).toHaveLength(EXAM.questionCount);
            expect(new Set(ids(exam)).size).toBe(EXAM.questionCount);
            exam.forEach(question => expect(ALL).toContain(question));
        }
    });
});

describe("getQuestionsByIds", () => {
    test("returns questions in the requested order", () => {
        const wanted = [ALL[5].id, ALL[0].id, ALL[42].id];
        expect(ids(getQuestionsByIds(wanted))).toEqual(wanted);
    });

    test("skips ids that no longer exist", () => {
        expect(ids(getQuestionsByIds([ALL[1].id, -1, 999999, ALL[2].id]))).toEqual([ALL[1].id, ALL[2].id]);
        expect(getQuestionsByIds([])).toEqual([]);
    });
});
