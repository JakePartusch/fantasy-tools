import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const SyncAccountModal = ({ open, handleClose }) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect with ESPN</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your login information to start the sync</DialogContentText>
          <TextField
            autoFocus
            id="username"
            label="Username"
            type="text"
            margin="normal"
            fullWidth
          />
          <TextField id="password" label="Password" type="password" margin="normal" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Sync
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SyncAccountModal;
