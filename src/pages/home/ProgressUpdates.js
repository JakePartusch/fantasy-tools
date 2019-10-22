/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import styled from '@emotion/styled';
import { Typography, Button, TextField, Snackbar } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
import axios from 'axios';
import ReactGA from 'react-ga';

const SubmitButton = styled(Button)({
  marginTop: '16px',
  marginBottom: '8px',
  marginLeft: '16px',
  height: '53px',
  '@media(max-width: 600px)': {
    margin: 0,
    width: '100%'
  }
});

const ProgressUpdates = () => {
  const [email, setEmail] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/dev/user/email', { email });
      setEmail('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 6000);
    } catch (e) {
      console.error('Unable to add email', e);
      ReactGA.event({
        category: 'User',
        action: 'Subscribe E-mail - Failure',
        value: email
      });
    }
  };
  return (
    <section css={{ maxWidth: 960, margin: '5rem auto 0 auto' }}>
      <Typography variant="h2">Get Progress Updates</Typography>
      <Typography variant="body1" css={{ margin: '2rem 0' }}>
        Enter your email to get notified about new features{' '}
        <span role="img" aria-label="tada">
          🎉
        </span>
      </Typography>
      <form onSubmit={onSubmit}>
        <div
          css={{
            display: 'flex',
            margin: 'auto',
            maxWidth: 600,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <TextField
            css={{ backgroundColor: '#fff', flexGrow: 1 }}
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            margin="normal"
            variant="outlined"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <SubmitButton type="submit" variant="contained" color="primary">
            Submit
          </SubmitButton>
        </div>
      </form>
      <Snackbar
        css={{
          div: {
            backgroundColor: green[600],
            display: 'flex',
            alignItems: 'center'
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={showSuccess}
        autoHideDuration={6000}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={
          <div>
            <CheckCircleIcon />
            <span css={{ marginLeft: '0.5rem' }} id="message-id">
              Thank you!
            </span>
          </div>
        }
      />
    </section>
  );
};

export default ProgressUpdates;
