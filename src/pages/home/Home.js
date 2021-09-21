/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Button, Grid } from '@material-ui/core';
import FansImg from './fans.svg';
import ListIcon from '@material-ui/icons/List';
import GearIcon from '@material-ui/icons/Settings';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import ProgressUpdates from './ProgressUpdates';
import OnboardingFlow from './OnboardingFlow';
import { useAuth0 } from '../../react-auth0-spa';

const Home = ({ user, setUser }) => {
  const [onboarding, setOnboarding] = useState(false);
  const history = useHistory();
  const { getIdTokenClaims, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (user) {
      setOnboarding(!user.isOnboardingComplete);
    }
  }, [user]);

  const handleOnboardingComplete = async () => {
    setOnboarding(false);
    setUser({ ...user, isOnboardingComplete: true });
    const tokens = await getIdTokenClaims();
    await axios.post('/api/user/onboarding', null, {
      headers: { Authorization: `Bearer ${tokens.__raw}` }
    });
  };

  return (
    <React.Fragment>
      <OnboardingFlow open={onboarding} handleClose={handleOnboardingComplete} />
      <Helmet>
        <title>Fantasy Tools | Home</title>
        <meta
          name="description"
          content="A suite of tools to give your fantasy football team the advantage"
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
            Fantasy Tools
          </Typography>
          <Typography
            css={{ padding: '20px', maxWidth: 600, fontSize: '18px', margin: 'auto' }}
            component="p"
            variant="subtitle1"
          >
            We strive to bring fantasy sports players a suite of tools to evaluate past performance
            and improve future results with unique data-driven simulations.
          </Typography>
          <Button
            css={{
              padding: '8px 16px',
              ':hover': {
                transform: 'scale(1.01)'
              }
            }}
            variant="contained"
            color="primary"
            onClick={() => history.push('/standings')}
          >
            Get Started!
          </Button>
        </div>
        <div css={{ width: 300, height: 270 }}>
          <img css={{ maxWidth: '100%' }} alt="Football fans on coach" src={FansImg} />
        </div>
      </header>
      <section css={{ maxWidth: 960, margin: '3rem auto 0 auto' }}>
        <Grid container spacing={2} justify={'center'} css={{ width: '100%' }}>
          <Grid item md={4} xs={10}>
            <Button
              className="rankings-simulator-btn"
              fullWidth={true}
              css={{ textTransform: 'none' }}
              onClick={() => history.push('/standings')}
            >
              <Card className="flex w-100" css={{ minHeight: 250 }} elevation={5}>
                <CardContent className="flex flex-col items-center justify-center">
                  <ListIcon color="primary" fontSize="large" />
                  <Typography css={{ marginBottom: '0.5rem' }} variant="h6" component="h2">
                    Standings Simulator
                  </Typography>
                  <div className="flex flex-col justify-between flex-grow">
                    <Typography>
                      We remove the randomness out of weekly matchups to give a better performance
                      picture.
                    </Typography>
                    <Button
                      css={{
                        ':hover': {
                          transform: 'scale(1.01)'
                        }
                      }}
                      variant="outlined"
                      color="primary"
                      onClick={() => history.push('/standings')}
                    >
                      Try it out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Button>
          </Grid>
          <Grid item md={4} xs={10}>
            <Button disabled={true} fullWidth={true} css={{ textTransform: 'none' }}>
              <Card css={{ minHeight: 250, width: '100%' }} elevation={4}>
                <CardContent>
                  <GearIcon color="primary" fontSize="large" />
                  <Typography variant="h6" component="h2">
                    Playoff Machine
                  </Typography>
                  <Typography css={{ marginBottom: '0.5rem' }} component="div" variant="subtitle1">
                    (Coming Soon)
                  </Typography>
                  <Typography>
                    We'll let you know exactly which games you need to win to get into the big
                    dance.
                  </Typography>
                </CardContent>
              </Card>
            </Button>
          </Grid>
          <Grid item md={4} xs={10}>
            <Button disabled={true} fullWidth={true} css={{ textTransform: 'none' }}>
              <Card css={{ minHeight: 250, width: '100%' }} elevation={4}>
                <CardContent>
                  <ThumbsUpDownIcon color="primary" fontSize="large" />
                  <Typography variant="h6" component="h2">
                    Trade Analyzer
                  </Typography>
                  <Typography css={{ marginBottom: '0.5rem' }} component="div" variant="subtitle1">
                    (Coming Soon)
                  </Typography>
                  <Typography>Optimize your trades with our AI tool</Typography>
                </CardContent>
              </Card>
            </Button>
          </Grid>
        </Grid>
      </section>
      <ProgressUpdates />
    </React.Fragment>
  );
};

export default Home;
