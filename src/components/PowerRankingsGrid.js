import React, { useState, useEffect } from 'react';
import { Grid, Segment, Header, Table, Loader, Button } from 'semantic-ui-react';
import { getPowerRankings } from '../api/FantasyFootballApiv2';
import { withRouter, Link } from 'react-router-dom';
import TableHeader from './grid/TableHeader';
import TableTotals from './grid/TableTotals';
import TeamHeaderCell from './grid/TeamHeaderCell';

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
      <Table.Cell textAlign="center" style={{ backgroundColor: getHslCellColor(wins, losses) }} key={`record-${index}`}>
        {wins} - {losses}
      </Table.Cell>
    );
  });
};

const PowerRankingsGrid = ({ match, history }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const { leagueId, seasonId } = match.params;

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        let rankings = await getPowerRankings(leagueId, seasonId);
        setRankings(rankings);
      } catch (e) {
        console.log(e);
        history.push('/error');
      }
      setLoading(false);
    };
    fetchRankings();
  }, [leagueId, seasonId, history]);

  const onDetailedViewClick = () => {
    setShowDetailedView(!showDetailedView);
  };

  return (
    <>
      <Loader active={loading} />
      <Grid centered>
        {rankings.length > 0 && (
          <Grid.Row>
            <Grid.Column computer={showDetailedView ? 14 : 8} mobile={15}>
              <Grid.Row>
                <Link to="/">Switch to a different League</Link>
                <Button
                  floated="right"
                  className="mobile-hide"
                  onClick={() => onDetailedViewClick()}
                  content={showDetailedView ? 'Show Simple View' : 'Show Detailed View'}
                />
              </Grid.Row>
              <Segment>
                <Header>Power Rankings {seasonId}</Header>
                <Table celled unstackable definition striped size="small">
                  <TableHeader showDetailedView={showDetailedView} rankings={rankings} />
                  <Table.Body>
                    {rankings.map((team, index) => (
                      <Table.Row key={`team-${index}`}>
                        <TeamHeaderCell team={team} />
                        {showDetailedView && displayWeeklyRecords(team, rankings.length)}
                        <TableTotals showDetailedView={showDetailedView} team={team} index={index} />
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </>
  );
};

export default withRouter(PowerRankingsGrid);
