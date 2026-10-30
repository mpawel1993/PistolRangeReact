import questionsData from "../assets/questions.json";
import {Answer, ALL_CATEGORIES, Question} from "../model";

interface RawQuestion {
    legacyId: number;
    value: string;
    goodAnswer: string;
    paragraph: string;
    category: string;
    possibleAnswer: Answer[];
}

const QUESTIONS: Question[] = (questionsData as RawQuestion[]).map(
    ({legacyId, value, goodAnswer, paragraph, category, possibleAnswer}) =>
        ({id: legacyId, value, goodAnswer, paragraph, category, possibleAnswer})
);

const QUESTIONS_BY_ID = new Map(QUESTIONS.map(question => [question.id, question]));

export const EXAM = {
    durationSeconds: 1800,
    questionCount: 20,
    goodAnswersToPass: 18,
};

function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function loadExamQuestions(): Question[] {
    return shuffle(QUESTIONS).slice(0, EXAM.questionCount);
}

export function getQuestionsByCategory(category: string, random: boolean): Question[] {
    const upper = category.toUpperCase();
    const filtered = upper === ALL_CATEGORIES ? QUESTIONS : QUESTIONS.filter(question => question.category === upper);
    return random ? shuffle(filtered) : filtered;
}

export function getQuestionsByIds(ids: number[]): Question[] {
    return ids.map(id => QUESTIONS_BY_ID.get(id)).filter((question): question is Question => question !== undefined);
}
