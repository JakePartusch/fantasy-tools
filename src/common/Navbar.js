/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, useMediaQuery } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';

import { useAuth0 } from '../react-auth0-spa';
import NavigationMenu from './NavigationMenu';
import AccountMenu from './AccountMenu';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const isLargeScreen = useMediaQuery('(min-width:960px)');

  return (
    <AppBar position="static">
      <Toolbar css={{ justifyContent: 'space-between' }}>
        <div css={{ display: 'flex' }}>
          <NavigationMenu />
          <Link
            to="/"
            css={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="h5" component="div">
              Fantasy Tools
            </Typography>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
