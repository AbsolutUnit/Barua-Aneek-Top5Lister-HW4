import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { GlobalStoreContext } from '../store'
import {useContext, useEffect} from 'react'
import AuthContext from '../auth'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);
  const {store} = useContext(GlobalStoreContext)


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    store.unmarkListForDeletion();
  };
  
  const handleDelete = () => {
    setOpen(false);
    store.deleteMarkedList();
  }

  let showable = false;
  let message = "";
  if (store.listMarkedForDeletion) {
      showable = true;
      message = "Are you sure you want to delete the " + store.listMarkedForDeletion.name + " Top 5 List?";
  }

  return (
    <div>
      <Dialog
        open = {showable}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}