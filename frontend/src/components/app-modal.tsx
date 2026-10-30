import {ReactNode} from "react";
import {Box, Modal} from "@mui/material";

interface AppModalProps {
    open: boolean;
    onClose?: () => void;
    children: ReactNode;
}

export const AppModal = ({open, onClose, children}: AppModalProps) => (
    <Modal open={open} onClose={onClose}>
        <Box className="modal">{children}</Box>
    </Modal>
);

export default AppModal;
