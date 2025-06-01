import {useAtom} from "jotai/index";
import {
    fromBeginUserEventAtom,
    fromBeginUserResponseAtom,
    isFromBeginModalVisibleAtom,
    storedQuestionCounterAtom
} from "../atoms/app-atoms";
import {useEffect} from "react";
import {Box, Modal} from "@mui/material";
import Field from "./field";
import {useSetAtom} from "jotai";
import {defaultModalStyle} from "../deafults";

export const FromBeginModal = () => {

    const [isFromBeginVisible, setIsFromVisible] = useAtom(isFromBeginModalVisibleAtom);
    const setIsFromBegin = useSetAtom(fromBeginUserResponseAtom);
    const [fromBeginEvent, setFromBeginEvent] = useAtom(fromBeginUserEventAtom);
    const storedQuestionCounter = useAtom(storedQuestionCounterAtom);

    useEffect(() => {
        return () => {
            setIsFromVisible(false);
            setIsFromBegin(true);
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
                OD NOWA?
                <br/>
                <br/>
                <> Poprzedni progres: {storedQuestionCounter}</>
                <br/>
                <br/>
                <div onClick={() => {
                    setIsFromBegin(true);
                    setIsFromVisible(false);
                    let event = fromBeginEvent
                    event++;
                    setFromBeginEvent(event);
                }}>
                    <Field text="Tak"/>
                </div>
                <div onClick={() => {
                    setIsFromBegin(false);
                    setIsFromVisible(false);
                    let event = fromBeginEvent
                    event++;
                    setFromBeginEvent(event);
                }}>
                    <Field text="Nie"/>
                </div>
            </div>
        </Box>
    </Modal>)
}
export default FromBeginModal;