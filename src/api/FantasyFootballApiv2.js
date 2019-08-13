import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import tough from 'tough-cookie';

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

export const getPowerRankings = async (leagueId, seasonId) => {
  const { data } = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchupScore&view=mStatus&view=mSettings&view=mTeam&view=modular&view=mNav`
  );
  //Grab all of the scores from each of the games play in the regular season
  const weeklyResults = data.schedule
    .filter(game => game.playoffTierType === 'NONE' && game.home.totalPoints > 0)
    .map(game => {
      if (game.away) {
        return {
          scores: [
            { teamId: game.away.teamId, score: game.away.totalPoints },
            { teamId: game.home.teamId, score: game.home.totalPoints }
          ],
          week: game.matchupPeriodId
        };
      }
      return {
        scores: [{ teamId: game.home.teamId, score: game.home.totalPoints }],
        week: game.matchupPeriodId
      };
    })
    .reduce((acc, game) => {
      if (acc[game.week]) {
        acc[game.week].scores = acc[game.week].scores.concat(game.scores);
      } else {
        acc[game.week] = {
          scores: [...game.scores]
        };
      }
      return acc;
    }, {});

  //Move scores into array of arrays
  const weeklyScores = [];
  for (let i = 1; i <= Object.keys(weeklyResults).length; i++) {
    weeklyScores.push(weeklyResults[i]);
  }

  //Sort the scores
  const sortedWeeklyScores = weeklyScores.map(week => {
    return week.scores.sort((a, b) => a.score - b.score);
  });

  //Map wins and scores onto team data
  const teams = data.teams.map(team => {
    const wins = sortedWeeklyScores.map(week => {
      return week.findIndex(teamScore => teamScore.teamId === team.id);
    });
    const scores = sortedWeeklyScores.map(week => {
      const matchingTeam = week.find(teamScore => teamScore.teamId === team.id);
      return matchingTeam ? matchingTeam.score : 0;
    });
    return {
      name: `${team.location} ${team.nickname}`,
      logo: team.logo,
      wins,
      scores,
      actualRecord: {
        wins: team.record.overall.wins,
        losses: team.record.overall.losses,
        ties: team.record.overall.ties
      },
      totalWins: wins.reduce((acc, x) => acc + x, 0),
      totalLosses: Object.keys(weeklyResults).length * (data.teams.length - 1) - wins.reduce((acc, x) => acc + x, 0)
    };
  });

  teams.sort((a, b) => b.totalWins - a.totalWins);
  return teams;
};
