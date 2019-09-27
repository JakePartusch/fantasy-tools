/** @jsx jsx */
import { jsx } from '@emotion/core';
import Navbar from './Navbar';
import { Typography, TextField, Button } from '@material-ui/core';
import GameDayImg from './game-day.svg';
import WaveImg from './wave.svg';

const Home = () => {
  return (
    <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
      <Navbar />
      <header
        css={{ minHeight: 288, padding: '48px 32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div>
          <Typography variant="h3" css={{ fontWeight: 600 }}>
            True Rankings
          </Typography>
          <Typography css={{ padding: '20px', maxWidth: 600, fontSize: '18px', margin: 'auto' }} variant="subtitle1">
            Tired of losing games due to random matchup bad luck? We'll simulate every possible matchup to see how your
            team truly stacks up against the competition.
          </Typography>
        </div>
        <img css={{ maxWidth: '300px' }} src={GameDayImg} />
      </header>
      <section css={{ background: '#f8f9fa' }}>
        <div css={{ maxWidth: 960, padding: '32px', margin: 'auto' }}>
          <div css={{ display: 'flex' }}>
            <TextField
              css={{ backgroundColor: '#fff' }}
              id="outlined-required"
              label="ESPN League URL"
              placeholder="https://fantasy.espn.com/football/team?leagueId=551785&seasonId=2018"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <div css={{ marginTop: '16px', marginBottom: '8px', marginLeft: '16px', display: 'flex' }}>
              <Button variant="contained" color="primary">
                Calculate
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <img src={WaveImg} />
      </footer>
    </div>
  );
};

export default Home;
