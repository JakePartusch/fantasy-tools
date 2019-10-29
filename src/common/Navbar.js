/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';

import { useAuth0 } from '../react-auth0-spa';
import NavigationMenu from './NavigationMenu';
import AccountMenu from './AccountMenu';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

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
        <div>
          {!isAuthenticated && (
            <Button color="inherit" onClick={() => loginWithRedirect({})}>
              Log in
            </Button>
          )}
          {isAuthenticated && <AccountMenu />}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
