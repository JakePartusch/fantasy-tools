/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Navbar = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    history.push(path);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleClose('/')}>Home</MenuItem>
          <MenuItem onClick={() => handleClose('/rankings')}>Rankings Simulator</MenuItem>
        </Menu>
        <Link to="/" css={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            Fantasy Tools
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
