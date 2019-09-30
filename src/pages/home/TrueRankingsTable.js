/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getPowerRankings } from '../../api/FantasyFootballApiv2';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
    maxWidth: 960
  }
}));

/*
  Should return a dark red for bad record and dark green for a good record,
  mediocre records should be light red/green
*/
const getHslCellColor = (wins, losses) => {
  const totalGames = losses + wins;
  if (wins < losses) {
    const winPercentage = wins / totalGames;
    return `hsl(0, 65%,${(winPercentage + 0.5) * 100}%)`;
  } else {
    const lossPercentage = losses / totalGames;
    return `hsl(100, 65%,${(lossPercentage + 0.4) * 100}%)`;
  }
};

const displayWeeklyRecords = (team, totalTeams) => {
  return team.wins.map((wins, index) => {
    const losses = totalTeams - 1 - wins;
    return (
      <TableCell
        align="center"
        css={{ padding: '14px', minWidth: '87px', backgroundColor: getHslCellColor(wins, losses) }}
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
  return rankings[0].wins.map((win, i) => (
    <TableCell key={`rankings-${i}`} textAlign="center">
      {i + 1}
    </TableCell>
  ));
};

export default function TrueRankinsTable(props) {
  const classes = useStyles();

  const isLargeScreen = useMediaQuery('(min-width:960px)');

  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { leagueId, seasonId = 2019 } = props;

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        let rankings = await getPowerRankings(leagueId, seasonId);
        setRankings(rankings);
        console.log(rankings);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchRankings();
  }, [leagueId, seasonId]);

  if (!leagueId || loading) {
    return null;
  }

  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell css={{ minWidth: '250px' }}>Team</TableCell>
            {isLargeScreen && displayWeeklyHeaders(rankings)}
            <TableCell align="right" css={{ minWidth: '125px' }}>
              Simulated Record
            </TableCell>
            <TableCell align="right" css={{ minWidth: '125px' }}>
              ESPN Record
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                <div css={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar alt={row.name} src={row.logo} />
                  <Typography css={{ marginLeft: '15px', fontSize: '1.25rem' }} variant="subtitle1">
                    {row.name}
                  </Typography>
                </div>
              </TableCell>
              {isLargeScreen && displayWeeklyRecords(row, rankings.length)}
              <TableCell align="right">
                <Typography variant="body1" css={{ fontWeight: '600' }}>
                  {row.totalWins} - {row.totalLosses}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1">
                  {row.actualRecord.wins} - {row.actualRecord.losses}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
