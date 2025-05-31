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
        <Box sx={style}>
            <div>
                Od poczatku ?
                <div onClick={() => {
                    setIsFromBegin(true);
                    setIsFromVisible(false);
                }}>
                    <Field text="Tak" />
                </div>
                <div onClick={() => {
                    setIsFromBegin(false);
                    setIsFromVisible(false);
                }}>
                    <Field text="Nie" />
                </div>
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
export default FromBeginModal;