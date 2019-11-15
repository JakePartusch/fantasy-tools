/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import qs from 'query-string';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Table from './StandingsSimulatorTable';
import { Typography } from '@material-ui/core';
import GameDayImg from './game-day.svg';
import ReactGA from 'react-ga';
import { useAuth0 } from '../../react-auth0-spa';
import StandingsForm from './StandingsForm';

const Home = () => {
  const [leagueId, setLeagueId] = React.useState();
  const [seasonId, setSeasonId] = React.useState(2019);
  const [leagues, setLeagues] = React.useState([]);
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const fetchLeagues = async () => {
      const tokens = await getIdTokenClaims();
      const { data } = await axios.get('/api/leagues', {
        headers: { Authorization: `Bearer ${tokens.__raw}` }
      });
      setLeagues(data.preferences);
    };
    if (isAuthenticated) {
      fetchLeagues();
    }
  }, [getIdTokenClaims, isAuthenticated]);

  const onSubmit = values => {
    const { espnUrl, league, season } = values;
    if (espnUrl) {
      const parsed = qs.parse(espnUrl.substring(espnUrl.indexOf('?'), espnUrl.length));
      setLeagueId(parsed.leagueId);
      setSeasonId(parsed.seasonId);
    } else {
      setLeagueId(league);
      setSeasonId(season);
    }
  };

  return (
    <>
      <Helmet>
        <title>Fantasy Tools | Standings Simulator</title>
        <meta
          name="description"
          content="A tool to simulate every possible matchup against teams in your league."
        />
      </Helmet>
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
            always seem to be paired against one of the top scoring teams? We'll eliminate the luck
            of the draw by simulating every possible matchup for each week, so you can see how your
            team truly stacks up.
          </Typography>
        </div>
        <div css={{ width: 300, height: 270 }}>
          <img css={{ maxWidth: '100%' }} alt="Game day illustration" src={GameDayImg} />
        </div>
      </header>
      <section css={{ background: '#f8f9fa' }}>
        <div css={{ maxWidth: 960, padding: '32px', margin: 'auto' }}>
          <StandingsForm onSubmit={onSubmit} isAuthenticated={isAuthenticated} leagues={leagues} />
        </div>
      </section>
      <section>
        <Table leagueId={leagueId} seasonId={seasonId} />
      </section>
    </>
  );
};

export default Home;
