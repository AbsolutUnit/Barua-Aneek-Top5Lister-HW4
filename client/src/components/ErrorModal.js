import * as React from 'react'
import AuthContext from '../auth'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Alert from '@mui/material/Alert'
import { GlobalStoreContext } from '../store'
import {useContext, useEffect} from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'clear',
    border: '2px solid $000',
    boxShadow: 24,
    p: 4,
}

export default function ErrorModal() {
    const [active, setActive] = React.useState(true);
    const {auth} = useContext(AuthContext);
    const {store} = useContext(GlobalStoreContext)
    const handleActive = () => setActive(true);
    const handleInactive = () => {
        auth.closeModal();
        setActive(false);
    }

    let showable = false;
    let message = "";
    if (auth.errorText) {
        showable = true;
        message = auth.errorText;
    }
    return (
        <Modal
            open = {showable}
            onClose = {handleInactive}
            aria-labelledby = "modal-modal-title"
            aria-describedby = "modal-modal-description"
        >
            <Box sx = {style}>
                <Alert severity = "error">{message}</Alert>
                <div class = "modal_button_pos">
                    <Button
                    variant = "contained"
                    onClick = {handleInactive}>
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}