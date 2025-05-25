import {Box, Modal, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

export const ExamSummary = ({goodCount} : {goodCount : number}) =>{
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <div style={{color:'#98c135'}}>
                UKOŃCZONO EGZAMIN

                { goodCount == 8 ? <div style={{color : 'red'}}>ZALICZONO</div> : <div style={{color : 'red'}}>NIE ZALICZONO</div>}
                <div style={{color : 'green'}}>DOBRZE: {goodCount} </div>
                <div style={{color : 'red'}}> ŹLE: {10 - goodCount}</div>
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