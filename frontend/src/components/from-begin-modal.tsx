import {useAtom, useAtomValue} from "jotai/index";
import {
    examDetailsAtom, fromBeginUserResponseAtom,
    goodAnswersCounterAtom,
    isExamSummaryVisibleAtom,
    isFromBeginModalVisibleAtom
} from "../atoms/app-atoms";
import {useEffect} from "react";
import {Box, Modal} from "@mui/material";
import Field from "./field";
import {useSetAtom} from "jotai";
import {defaultModalStyle} from "../deafults";

export const FromBeginModal = () => {

    const [isFromBeginVisible, setIsFromVisible] = useAtom(isFromBeginModalVisibleAtom);
    const setIsFromBegin = useSetAtom(fromBeginUserResponseAtom);

    useEffect(() => {
        return () => {
            setIsFromVisible(false);
        };
    }, []);


    return (<Modal
        open={isFromBeginVisible}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={defaultModalStyle}>
            <div style={{
                display: 'inline-block',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                textAlign: 'center',
                color: 'white',
            }}>
                Od poczatku ?
                <br/>
                <br/>
                <div onClick={() => {
                    setIsFromBegin(false);
                    setIsFromVisible(false);
                }}>
                    <Field text="Tak"/>
                </div>
                <div onClick={() => {
                    setIsFromBegin(true);
                    setIsFromVisible(false);
                }}>
                    <Field text="Nie"/>
                </div>
            </div>
        </Box>
    </Modal>)
}
export default FromBeginModal;