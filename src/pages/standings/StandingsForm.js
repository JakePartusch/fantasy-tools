/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import styled from '@emotion/styled';
import { Formik, Form } from 'formik';
import { Typography, TextField, Button } from '@material-ui/core';

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

const StandingsForm = ({ isAuthenticated, onSubmit }) => {
  const handleSubmit = values => {
    console.log(values);
    onSubmit(values);
  };
  return (
    <Formik initialValues={{ espnUrl: '' }} onSubmit={handleSubmit}>
      {({ handleChange, values }) => (
        <Form>
          <div css={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              css={{ backgroundColor: '#fff', flexGrow: 1 }}
              id="espnUrl"
              name="espnUrl"
              label="ESPN League Homepage URL"
              placeholder="https://fantasy.espn.com/football/league?leagueId=1234567"
              onChange={handleChange}
              value={values.espnUrl}
              margin="normal"
              variant="outlined"
            />
            <SubmitButton type="submit" variant="contained" color="primary">
              Calculate
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StandingsForm;
