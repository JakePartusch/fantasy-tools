/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  FormControlLabel,
  Switch,
  Grid
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from '@emotion/styled';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
    maxWidth: 1400
  }
}));

/*
  Should return a dark red for bad record and dark green for a good record,
  mediocre records should be light red/green
*/
const getHslCellColor = (wins, losses, colorBlindMode) => {
  const red = colorBlindMode ? '323' : '0';
  const green = colorBlindMode ? '103' : '100';
  const totalGames = losses + wins;
  if (wins < losses) {
    const winPercentage = wins / totalGames;
    return `hsl(${red}, 65%,${(winPercentage + 0.5) * 100}%)`;
  } else {
    const lossPercentage = losses / totalGames;
    return `hsl(${green}, 65%,${(lossPercentage + 0.4) * 100}%)`;
  }
};

const displayWeeklyRecords = (team, totalTeams, colorBlindMode) => {
  return team.wins.map((wins, index) => {
    const losses = totalTeams - 1 - wins;
    return (
      <TableCell
        align="center"
        css={{ padding: '10px', backgroundColor: getHslCellColor(wins, losses, colorBlindMode) }}
        key={`record-${index}`}
      >
        {wins} - {losses}
      </TableCell>
    );
  });
};

const displayWeeklyHeaders = rankings => {
  if (rankings.length === 0) {
    return null;
  }
  return rankings[0].wins.map((win, i) => <TableCell key={`rankings-${i}`}>{i + 1}</TableCell>);
};

const TeamName = ({ name, isLargeScreen }) => {
  return (
    <Typography
      css={{
        marginLeft: isLargeScreen ? '15px' : '',
        fontSize: isLargeScreen ? '1.25rem' : '0.85rem'
      }}
      variant="subtitle1"
      component="span"
    >
      {name}
    </Typography>
  );
};

const StyledTableCell = styled(TableCell)({
  padding: '14px'
});

export default function TrueRankinsTable(props) {
  const classes = useStyles();
  const isLargeScreen = useMediaQuery('(min-width:960px)');
  const [colorBlindMode, setColorBlindMode] = useState(false);

  const { rankings } = props;

  if (!rankings) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      {rankings.length > 0 && (
        <React.Fragment>
          {isLargeScreen && (
            <Grid container direction="row-reverse" justify="flex-start" alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={colorBlindMode}
                    onChange={() => setColorBlindMode(!colorBlindMode)}
                    value="colorBlindMode"
                    color="primary"
                  />
                }
                label="High Contrast Mode"
              />
            </Grid>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell css={{ minWidth: isLargeScreen ? '250px' : undefined }}>
                  Team
                </StyledTableCell>
                {isLargeScreen && displayWeeklyHeaders(rankings)}
                <StyledTableCell
                  align="center"
                  css={{ minWidth: isLargeScreen ? '100px' : undefined }}
                >
                  Simulated Record
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  css={{ minWidth: isLargeScreen ? '100px' : undefined }}
                >
                  ESPN Record
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map(row => (
                <TableRow key={row.name}>
                  <StyledTableCell>
                    <div css={{ display: 'flex', alignItems: 'center' }}>
                      {isLargeScreen && <Avatar alt={row.name} src={row.logo} />}
                      <TeamName name={row.name} isLargeScreen={isLargeScreen} />
                    </div>
                  </StyledTableCell>
                  {isLargeScreen && displayWeeklyRecords(row, rankings.length, colorBlindMode)}
                  <StyledTableCell align="center" className="simulated-record-cell">
                    <Typography variant="body1" css={{ fontWeight: '600' }}>
                      {row.totalWins} - {row.totalLosses}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center" className="actual-record-cell">
                    <Typography variant="body1">
                      {row.actualRecord.wins} - {row.actualRecord.losses}
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      )}
    </Paper>
  );
}
