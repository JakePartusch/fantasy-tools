import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useAuth0 } from '../react-auth0-spa';
import SyncAccountModal from './SyncAccountModal';

const NavigationMenu = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout } = useAuth0();
  const [open, setOpen] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    history.push(path);
  };

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="Account Menu" onClick={handleClick}>
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleModalOpen(true)}>Sync Fantasy Team</MenuItem>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </Menu>
      <SyncAccountModal open={open} handleClose={handleModalClose} />
    </>
  );
};

export default NavigationMenu;
