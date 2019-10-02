/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import qs from 'query-string';
import Navbar from './Navbar';
import Table from './TrueRankingsTable';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { Typography, TextField, Button, createMuiTheme } from '@material-ui/core';
import GameDayImg from './game-day.svg';
import WaveImg from './wave.svg';
import { useState } from 'react';

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem'
    }
  }
});

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

const Home = () => {
  const [espnUrl, setEspnUrl] = useState();
  const [leagueId, setLeagueId] = useState();
  const [seasonId, setSeasonId] = useState(2019);

  const onSubmit = e => {
    e.preventDefault();
    const parsed = qs.parse(espnUrl.substring(espnUrl.indexOf('?'), espnUrl.length));
    setLeagueId(parsed.leagueId);
    setSeasonId(parsed.seasonId);
  };

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
          <Navbar />
          <header
            css={{
              minHeight: 288,
              padding: '48px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div>
              <Typography variant="h1" css={{ fontWeight: 600 }}>
                Power Rankings
              </Typography>
              <Typography
                css={{ padding: '20px', maxWidth: 600, fontSize: '18px', margin: 'auto' }}
                variant="subtitle1"
              >
                Tired of losing your matchup while scoring the second most points in your league? Do you always seem to
                be paired against one of the top scoring teams? We'll eliminate the luck of the draw by simulating every
                possible matchup for each week, so you can see how your team truly stacks up.
              </Typography>
            </div>
            <img css={{ maxWidth: '300px' }} alt="Game day illustration" src={GameDayImg} />
          </header>
          <section css={{ background: '#f8f9fa' }}>
            <div css={{ maxWidth: 960, padding: '32px', margin: 'auto' }}>
              <form onSubmit={onSubmit}>
                <div css={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    css={{ backgroundColor: '#fff', flexGrow: 1 }}
                    id="outlined-required"
                    label="ESPN League Homepage URL"
                    placeholder="https://fantasy.espn.com/football/league?leagueId=1234567"
                    onChange={e => setEspnUrl(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <SubmitButton type="submit" variant="contained" color="primary">
                    Calculate
                  </SubmitButton>
                </div>
              </form>
            </div>
          </section>
          <section>
            <Table leagueId={leagueId} seasonId={seasonId} />
          </section>
          <footer>
            <img alt="Wave footer" src={WaveImg} />
          </footer>
        </div>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default Home;
