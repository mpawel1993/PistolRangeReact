import questionsData from "../assets/questions.json";
import {ExamDetails, Question, WeaponLawCategory} from "../model/model";

// Shape of a question as stored in the embedded data file.
interface RawQuestion {
    id: string | null;
    displayId: number | null;
    value: string;
    goodAnswer: string;
    paragraph: string;
    legacyId: number | null;
    category: string;
    possibleAnswer: { id: string; value: string }[];
}

const ALL_QUESTIONS = questionsData as RawQuestion[];

// Previously served by GET /exam/details (hardcoded defaults on the server).
const EXAM_DETAILS: ExamDetails = {
    examDuration: 1800,
    goodAnswersToPass: 18,
    answersCount: 20,
};

function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Mirrors the server's behaviour: assign a 1-based displayId to each question.
function withDisplayIds(questions: RawQuestion[]): Question[] {
    return questions.map((question, index) => ({
        ...question,
        displayId: index + 1,
    })) as unknown as Question[];
}

// Replaces GET /exam/details
export function getExamDetails(): ExamDetails {
    return EXAM_DETAILS;
}

// Replaces GET /exam/load
export function loadQuestionsForExam(): Question[] {
    const shuffled = shuffle(ALL_QUESTIONS);
    return withDisplayIds(shuffled.slice(0, EXAM_DETAILS.answersCount));
}

// Replaces GET /learn/category/{category}/{randomQuestions}
export function getQuestionsByCategory(category: string, randomQuestions: boolean): Question[] {
    const upper = category.toUpperCase();
    let filtered = upper === WeaponLawCategory.WSZYSTKIE
        ? [...ALL_QUESTIONS]
        : ALL_QUESTIONS.filter((question) => question.category === upper);
    if (randomQuestions) {
        filtered = shuffle(filtered);
    }
    return withDisplayIds(filtered);
}
