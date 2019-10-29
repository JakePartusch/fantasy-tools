import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const NavigationMenu = () => {
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
    <>
      <IconButton edge="start" color="inherit" aria-label="Navigation Menu" onClick={handleClick}>
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
    </>
  );
};

export default NavigationMenu;
