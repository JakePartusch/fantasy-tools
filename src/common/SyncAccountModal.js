import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { useAuth0 } from '../react-auth0-spa';

const SyncAccountModal = ({ open, handleClose }) => {
  const { getIdTokenClaims } = useAuth0();

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect with ESPN</DialogTitle>
        <Formik
          initialValues={{
            username: '',
            password: ''
          }}
          onSubmit={async values => {
            const tokens = await getIdTokenClaims();
            await axios.post(
              '/api/user/accountSync',
              { ...values, type: 'ESPN' },
              { headers: { Authorization: `Bearer ${tokens.__raw}` } }
            );
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <DialogContent>
                <DialogContentText>
                  Enter your login information to start the sync
                </DialogContentText>
                <TextField
                  autoFocus
                  id="username"
                  label="Username"
                  type="text"
                  margin="normal"
                  fullWidth
                  value={values.username}
                  onChange={handleChange}
                />
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" onClick={handleClose} color="primary">
                  Sync
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default SyncAccountModal;
