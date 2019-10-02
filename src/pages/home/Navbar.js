/** @jsx jsx */
import { jsx } from '@emotion/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar css={{ display: 'flex', justifyContent: 'space-between' }}>
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5">Fantasy Football Power Rankings</Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
