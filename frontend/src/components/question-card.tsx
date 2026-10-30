import {ReactNode} from "react";
import badger from "../assets/badger.png";
import {AnswerState, Question} from "../model";

interface QuestionCardProps {
    title: ReactNode;
    position: number;
    total: number;
    question: Question;
    disabled: boolean;
    stateOf: (answerId: string) => AnswerState;
    isMarked?: (answerId: string) => boolean;
    onPick: (answerId: string) => void;
}

export const QuestionCard = ({title, position, total, question, disabled, stateOf, isMarked, onPick}: QuestionCardProps) => (
    <>
        <header className="question-header">
            <div className="question-header__badge">
                <img src={badger} alt=""/>
                <span>{position}/{total}</span>
            </div>
            <div className="question-header__title">{title}</div>
        </header>

        <p className="question-text">
            {question.value} <span className="question-text__paragraph">{question.paragraph}</span>
        </p>

        <div className="answers">
            {question.possibleAnswer.map(answer => (
                <div key={answer.id} className="answer">
                    <span className={`answer__letter${isMarked?.(answer.id) ? " answer__letter--marked" : ""}`}>
                        {answer.id.toUpperCase()}
                    </span>
                    <button type="button" className="answer__button" data-state={stateOf(answer.id)}
                            disabled={disabled} onClick={() => onPick(answer.id)}>
                        {answer.value}
                    </button>
                </div>
            ))}
        </div>
    </>
);

export default QuestionCard;
