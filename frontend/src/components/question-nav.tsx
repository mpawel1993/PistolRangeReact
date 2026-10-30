import {ReactNode} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface QuestionNavProps {
    onPrevious: () => void;
    onNext: () => void;
    previousDisabled: boolean;
    nextDisabled: boolean;
    center: { icon: ReactNode; label: string; onClick: () => void };
}

export const QuestionNav = ({onPrevious, onNext, previousDisabled, nextDisabled, center}: QuestionNavProps) => (
    <nav className="question-nav">
        <button type="button" className="nav-button" aria-label="Poprzednie pytanie"
                onClick={onPrevious} disabled={previousDisabled}>
            <ArrowBackIcon/>
        </button>
        <button type="button" className="nav-button" aria-label={center.label} onClick={center.onClick}>
            {center.icon}
        </button>
        <button type="button" className="nav-button" aria-label="Następne pytanie"
                onClick={onNext} disabled={nextDisabled}>
            <ArrowForwardIcon/>
        </button>
    </nav>
);

export default QuestionNav;
