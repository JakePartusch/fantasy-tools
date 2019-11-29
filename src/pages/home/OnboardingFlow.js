/** @jsx jsx */
import { jsx } from '@emotion/core';
// eslint-disable-next-line
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MobileStepper,
  TextField,
  CircularProgress,
  Link
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Formik, Form } from 'formik';
import axios from 'axios';
import SyncImg from './sync.svg';
import SuccessImg from './success.svg';
import { useAuth0 } from '../../react-auth0-spa';

const DotsMobileStepper = ({ activeStep, handleBack, handleNext, loading }) => {
  return (
    <MobileStepper
      css={{
        flexGrow: 1
      }}
      variant="dots"
      steps={3}
      position="static"
      activeStep={activeStep}
      nextButton={
        <Button size="small" onClick={handleNext} className="focus:outline-none">
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              {activeStep === 2 ? 'Get Started!' : 'Next'} <KeyboardArrowRight />
            </>
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {<KeyboardArrowLeft />}
          Back
        </Button>
      }
    />
  );
};

const WelcomeStep = () => {
  return (
    <>
      <DialogTitle id="alert-dialog-title">Welcome!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let's get started by syncing your fantasy football account with Fantasy Tools. We'll then
          automatically integrate each of your leagues directly with our simulation tools.
        </DialogContentText>
        <div css={{ display: 'flex', justifyContent: 'center', height: 250 }}>
          <img css={{ maxWidth: '100%' }} alt="Synchronize to cloud" src={SyncImg} />
        </div>
      </DialogContent>
    </>
  );
};

const SuccessStep = () => {
  return (
    <>
      <DialogTitle id="alert-dialog-title">Success!</DialogTitle>
      <DialogContent>
        <div css={{ display: 'flex', justifyContent: 'center', height: 250 }}>
          <img css={{ maxWidth: '100%' }} alt="Phone with checkmark" src={SuccessImg} />
        </div>
      </DialogContent>
    </>
  );
};

const SyncAccountForm = ({ formRef, setSyncValues, syncError, handleClose }) => {
  return (
    <>
      <DialogTitle id="alert-dialog-title">Sync ESPN Account</DialogTitle>
      <DialogContent>
        {syncError && (
          <DialogContentText color="secondary">
            We were unable to sync your account. Please try again.
          </DialogContentText>
        )}
        <DialogContentText>Enter your login information to start the sync</DialogContentText>
        <DialogContentText css={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
          <Link href="#" onClick={handleClose}>
            Skip this for now
          </Link>
        </DialogContentText>
        <Formik
          ref={formRef}
          initialValues={{
            username: '',
            password: ''
          }}
          onSubmit={async values => {
            setSyncValues(values);
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <TextField
                autoFocus
                id="username"
                label="Username"
                type="email"
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
            </Form>
          )}
        </Formik>
      </DialogContent>
    </>
  );
};

export default function OnboardingFlow({ open, handleClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [syncValues, setSyncValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const history = useHistory();
  const formRef = useRef(null);
  const { getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const onSubmit = async values => {
      if (values.username && values.password) {
        setLoading(true);
        setSyncError(false);
        try {
          const tokens = await getIdTokenClaims();
          await axios.post(
            '/api/user/accountSync',
            { ...values, type: 'ESPN' },
            { headers: { Authorization: `Bearer ${tokens.__raw}` } }
          );
          setActiveStep(2);
        } catch (e) {
          console.error('Unable to sync account', e);
          setSyncError(true);
        }
        setLoading(false);
      }
    };

    onSubmit(syncValues);
  }, [getIdTokenClaims, syncValues]);

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    } else {
      if (activeStep === 2) {
        handleClose();
        history.push('/standings');
      }
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      css={{
        textAlign: 'center',
        '> div': {
          '> div': {
            '@media(min-width:600px)': {
              minWidth: 600
            },
            minHeight: 450,
            display: 'flex',
            justifyContent: 'space-between'
          }
        }
      }}
    >
      {activeStep === 0 && <WelcomeStep />}
      {activeStep === 1 && (
        <SyncAccountForm
          formRef={formRef}
          handleClose={handleClose}
          setSyncValues={setSyncValues}
          syncError={syncError}
        />
      )}
      {activeStep === 2 && <SuccessStep />}
      <DialogActions>
        <DotsMobileStepper
          loading={loading}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      </DialogActions>
    </Dialog>
  );
}
