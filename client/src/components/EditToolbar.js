import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleUndo() {
        store.undo();
        store.updateToolbar();
    }
    function handleRedo() {
        store.redo();
        store.updateToolbar();
    }
    function handleClose() {
        store.closeCurrentList();
        store.updateToolbar();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }  
    return (
        <div id="edit-toolbar">
            <Button 
                id='undo-button'
                onClick={handleUndo}
                className = "top5-button-disabled"
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                id='redo-button'
                onClick={handleRedo}
                className = "top5-button-disabled"
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                id='close-button'
                disabled = {editStatus}
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;