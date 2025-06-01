import {Box, Modal} from "@mui/material";
import {useEffect} from "react";
import {useAtom, useAtomValue} from "jotai";
import {examDetailsAtom, goodAnswersCounterAtom, isExamSummaryVisibleAtom} from "../atoms/app-atoms";
import passed from "../assets/passed.gif";
import failed from "../assets/failed.gif";
import Field from "./field";
import {defaultModalStyle} from "../deafults";

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
    >
        <Box sx={{...defaultModalStyle, textAlign: 'center'}}>
            <div style={{color: '#98c135'}}>
                UKOŃCZONO EGZAMIN
                {goodAnswersCount == examDetails.goodAnswersToPass ?
                    <img style={{
                        width: '100%',
                        height: 'auto'
                    }} src={passed} alt="Logo"/> :
                    <img style={{
                        width: '100%',
                        height: 'auto'
                    }} src={failed} alt="Logo"/>}

                <div style={{color: 'green'}}>DOBRZE: {goodAnswersCount} </div>
                <div style={{color: 'red'}}> ŹLE: {examDetails.answersCount - goodAnswersCount}</div>
            </div>
            <div onClick={() => setIsSummaryOpen(false)}>
                <Field text="PRZEGLĄDAJ"/>
            </div>
        </Box>
    </Modal>)
}
export default ExamSummary;