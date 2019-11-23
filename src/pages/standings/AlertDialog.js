import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useAuth0 } from '../../react-auth0-spa';

export default function AlertDialog({ open, onClose }) {
  const { isAuthenticated } = useAuth0();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Unable to fetch League Data</DialogTitle>
      <DialogContent>
        {!isAuthenticated ? (
          <>
            <DialogContentText id="alert-dialog-description">
              Make sure that you are logged into your league in a new tab in the same browser
              window.
            </DialogContentText>
            <DialogContentText>
              Still having trouble? Make sure that the URL contains the League ID (ex.
              leagueId=12345)
            </DialogContentText>
          </>
        ) : (
          <DialogContentText align="center">Please try again later.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
