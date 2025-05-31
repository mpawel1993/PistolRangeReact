import {Box, Modal} from "@mui/material";
import {useEffect} from "react";
import {useAtom, useAtomValue} from "jotai";
import {examDetailsAtom, goodAnswersCounterAtom, isExamSummaryVisibleAtom} from "../atoms/app-atoms";

export const ExamSummary = () => {

    const [isSummaryOpen, setIsSummaryOpen] = useAtom(isExamSummaryVisibleAtom);
    const [goodAnswersCount, setGoodAnswersCount] = useAtom(goodAnswersCounterAtom);
    const examDetails = useAtomValue(examDetailsAtom);

    useEffect(() => {
        return () => {
            setIsSummaryOpen(false);
            setGoodAnswersCount(0);
        };
    }, []);


    return (<Modal
        open={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <div style={{color: '#98c135'}}>
                UKOŃCZONO EGZAMIN
                {goodAnswersCount == examDetails.goodAnswersToPass ? <div style={{color: 'red'}}>ZALICZONO</div> :
                    <div style={{color: 'red'}}>NIE ZALICZONO</div>}
                <div style={{color: 'green'}}>DOBRZE: {goodAnswersCount} </div>
                <div style={{color: 'red'}}> ŹLE: {examDetails.answersCount - goodAnswersCount}</div>
            </div>
        </Box>
    </Modal>)
}

const style = {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translate(-50%)',
    width: '100%',
    maxWidth: '1000px',
    bgcolor: 'white',
    border: '2px solid #000',
    p: 4,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
};
export default ExamSummary;