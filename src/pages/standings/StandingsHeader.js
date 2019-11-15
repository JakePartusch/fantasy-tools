/** @jsx jsx */
import { jsx } from '@emotion/core';
// eslint-disable-next-line
import React from 'react';
import { Typography } from '@material-ui/core';
import GameDayImg from './game-day.svg';

const StandingsHeader = () => (
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
        Standings Simulator
      </Typography>
      <Typography
        css={{ padding: '20px', maxWidth: 600, fontSize: '18px', margin: 'auto' }}
        component="p"
        variant="subtitle1"
      >
        Tired of losing your matchup while scoring the second most points in your league? Do you
        always seem to be paired against one of the top scoring teams? We'll eliminate the luck of
        the draw by simulating every possible matchup for each week, so you can see how your team
        truly stacks up.
      </Typography>
    </div>
    <div css={{ width: 300, height: 270 }}>
      <img css={{ maxWidth: '100%' }} alt="Game day illustration" src={GameDayImg} />
    </div>
  </header>
);

export default StandingsHeader;
