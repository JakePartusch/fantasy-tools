/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Card, CardContent, Button, Grid } from '@material-ui/core';
import FansImg from './fans.svg';
import ListIcon from '@material-ui/icons/List';
import GearIcon from '@material-ui/icons/Settings';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import ProgressUpdates from './ProgressUpdates';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <React.Fragment>
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
        <img css={{ maxWidth: '300px' }} alt="Football fans on coach" src={FansImg} />
      </header>
      <section css={{ maxWidth: 960, margin: '3rem auto 0 auto' }}>
        <Grid container spacing={2} justify={'center'}>
          <Grid item md={4} xs={10}>
            <Button
              className="rankings-simulator-btn"
              fullWidth={true}
              css={{ textTransform: 'none' }}
              onClick={() => history.push('/standings')}
            >
              <Card css={{ minHeight: 250, width: '100%' }} elevation={5}>
                <CardContent>
                  <ListIcon color="primary" fontSize="large" />
                  <Typography css={{ marginBottom: '0.5rem' }} variant="h6" component="h2">
                    Standings Simulator
                  </Typography>
                  <Typography>
                    We remove the randomness out of weekly matchups to give a better performance
                    picture.
                  </Typography>
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
