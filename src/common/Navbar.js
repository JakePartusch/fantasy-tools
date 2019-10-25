/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { useAuth0 } from '../react-auth0-spa';

const Navbar = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    history.push(path);
  };
  return (
    <AppBar position="static">
      <Toolbar css={{ justifyContent: 'space-between' }}>
        <div css={{ display: 'flex' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClose('/')}>Home</MenuItem>
            <MenuItem onClick={() => handleClose('/standings')}>Standings Simulator</MenuItem>
          </Menu>
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
          {isAuthenticated && (
            <Button color="inherit" onClick={() => logout()}>
              Log out
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
