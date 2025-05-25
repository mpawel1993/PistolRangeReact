import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {Box, Modal} from "@mui/material";
import {useState} from "react";

export const EndOfModuleModal = () => {

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
            Brawo Ukonczyles modul
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

export default EndOfModuleModal;