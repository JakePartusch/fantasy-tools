/** @jsx jsx */
import { jsx } from '@emotion/core';
import WaveImg from './wave.svg';
import { Typography } from '@material-ui/core';

const Footer = () => {
  return (
    <footer css={{ backgroundImage: `url(${WaveImg})`, backgroundSize: 'cover' }}>
      <div css={{ minHeight: 300, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Typography css={{ margin: '0.5rem', color: '#fff' }}>© Jake Partusch. All rights reserved.</Typography>
      </div>
    </footer>
  );
};

export default Footer;
