/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import qs from 'query-string';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import StandingsSimulatorTable from './StandingsSimulatorTable';
import { useAuth0 } from '../../react-auth0-spa';
import StandingsForm from './StandingsForm';
import StandingsHeader from './StandingsHeader';
import AlertDialog from './AlertDialog';
import { getPowerRankings } from '../../api/FantasyFootballApiv2';
import FullPageLoader from '../../common/FullPageLoader';

const Home = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [rankings, setRankings] = React.useState();
  const [leagues, setLeagues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const fetchLeagues = async () => {
      const tokens = await getIdTokenClaims();
      try {
        const { data } = await axios.get('/api/leagues', {
          headers: { Authorization: `Bearer ${tokens.__raw}` }
        });
        setLeagues(data.preferences);
      } catch (e) {
        console.error('Unable to fetch leagues', e);
      }
      setPageLoading(false);
    };
    if (isAuthenticated) {
      fetchLeagues();
    } else {
      setPageLoading(false);
    }
  }, [getIdTokenClaims, isAuthenticated]);

  const fetchRankings = async (leagueId, seasonId = '2020') => {
    setLoading(true);
    try {
      if (leagueId && seasonId) {
        const tokens = await getIdTokenClaims();
        let rankings = await getPowerRankings(leagueId, seasonId, isAuthenticated, tokens);
        setRankings(rankings);
        ReactGA.event({
          category: 'User',
          action: 'Searched Rankings - Success'
        });
      }
    } catch (e) {
      console.error(e);
      ReactGA.event({
        category: 'User',
        action: 'Searched Rankings - Failure',
        value: `LeagueId: ${leagueId}, SeasonId: ${seasonId}`
      });
      setShowAlert(true);
    }
    setLoading(false);
  };

  const onSubmit = values => {
    const { espnUrl, league, season } = values;
    if (espnUrl) {
      const parsed = qs.parse(espnUrl.substring(espnUrl.indexOf('?'), espnUrl.length));
      fetchRankings(parsed.leagueId, parsed.seasonId);
    } else {
      fetchRankings(league, season);
    }
  };

  if (pageLoading) {
    return <FullPageLoader />;
  }
  return (
    <>
      <AlertDialog open={showAlert} onClose={() => setShowAlert(false)} />
      <Helmet>
        <title>Fantasy Tools | Standings Simulator</title>
        <meta
          name="description"
          content="A tool to simulate every possible matchup against teams in your league."
        />
      </Helmet>
      <StandingsHeader />
      <section css={{ background: '#f8f9fa' }}>
        <div css={{ maxWidth: 960, padding: '32px', margin: 'auto' }}>
          <StandingsForm
            onSubmit={onSubmit}
            isAuthenticated={isAuthenticated && leagues.length > 0}
            leagues={leagues}
            loading={loading}
          />
        </div>
      </section>
      <section>
        <StandingsSimulatorTable rankings={rankings} />
      </section>
    </>
  );
};

export default Home;
