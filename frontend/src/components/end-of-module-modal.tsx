import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {Box, Modal} from "@mui/material";
import {useEffect, useState} from "react";
import {useAtom} from "jotai/index";
import {isExamSummaryVisibleAtom, isModuleSummaryVisibleAtom} from "../atoms/app-atoms";
import passed from "../assets/passed.gif";
import Field from "./field";

export const EndOfModuleModal = () => {

    const [isSummaryOpen, setIsSummaryOpen] = useAtom(isModuleSummaryVisibleAtom);

    useEffect(() => {
        return () => {
            setIsSummaryOpen(false);
        };
    }, []);

    return (<div>
        <Modal
            open={isSummaryOpen}
            onClose={() => setIsSummaryOpen(false)}
        >
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Centers the modal
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                width: '100%',
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{color: '#98c135', textAlign: 'center'}}>
                    UKOŃCZONO MODUŁ
                    <img style={{
                        width: '100%',
                        height: 'auto'
                    }} src={passed} alt="Logo"/>
                </div>
                <div style={{color: 'red', width: '100%', textAlign: 'center'}}
                     onClick={() => setIsSummaryOpen(false)}
                >
                    <Field text="ZAMKNIJ"/>
                </div>
            </Box>
        </Modal>
    </div>)
}

export default EndOfModuleModal;