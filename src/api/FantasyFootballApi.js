import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import tough from 'tough-cookie';
import { flattenDeep, cloneDeep, values } from 'lodash';

export class FantasyFootballApi {
  constructor() {
    axiosCookieJarSupport(axios);
    const cookieJar = new tough.CookieJar();

    axios.defaults.jar = cookieJar;
    axios.defaults.withCredentials = true;
  }

  getPowerRankings = async (leagueId, seasonId) => {
    const userData = await this.getUserData(leagueId, seasonId);
    let weeklyWins = await this.getWeeklyWinsForSeason(leagueId, seasonId);
    let rankings = this.calculateSeasonWinTotal(cloneDeep(weeklyWins));
    rankings = rankings.map(team => ({
      ...userData.find(user => user.id === team.id),
      ...team,
      weeklyWinData: []
    }));
    weeklyWins = weeklyWins.filter(week => week.length);
    weeklyWins.forEach(week => {
      rankings = rankings.map(team => {
        const winData = week.find(user => user.id === team.id);
        return {
          weeklyWinData:
            winData && winData.wins + winData.losses > 0 ? team.weeklyWinData.push(winData) : team.weeklyWinData,
          ...team
        };
      });
    });
    return rankings;
  };

  getWeeklyWinsForSeason = async (leagueId, seasonId) => {
    const weeklyScoreDataForSeason = await this.getWeeklyScoreDataForSeason(leagueId, seasonId);
    return this.calculateWeeklyWinsForSeason(weeklyScoreDataForSeason);
  };

  getUserData = async (leagueId, seasonId) => {
    var response = await axios.get(
      `https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`
    );
    return values(response.data.leaguesettings.teams).map(team => ({
      id: team.teamId,
      logoUrl: team.logoUrl ? team.logoUrl : 'https://openclipart.org/image/2400px/svg_to_png/202776/pawn.png',
      owner: `${team.owners[0].firstName} ${team.owners[0].lastName}`,
      name: `${team.teamLocation} ${team.teamNickname}`,
      overallWins: team.record.overallWins,
      overallLosses: team.record.overallLosses,
      overallStanding: team.overallStanding
    }));
  };

  getLeagueData = async (leagueId, seasonId) => {
    var response = await axios.get(
      `https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`
    );
    return {
      name: response.data.leaguesettings.name
    };
  };

  calculateSeasonWinTotal = weeklyWinsForSeason => {
    let seasonTotal = [];
    weeklyWinsForSeason.forEach(weekWins => {
      weekWins.forEach(team => {
        if (seasonTotal.find(seasonTotalTeam => seasonTotalTeam.id === team.id)) {
          let element = seasonTotal.find(seasonTotalTeam => seasonTotalTeam.id === team.id);
          seasonTotal[seasonTotal.indexOf(element)].wins += team.wins;
          seasonTotal[seasonTotal.indexOf(element)].losses += team.losses;
        } else {
          seasonTotal.push(team);
        }
      });
    });
    seasonTotal.sort((a, b) => {
      return b.wins - a.wins;
    });
    return seasonTotal;
  };

  //Given the weekly score data is already sorted by score from low -> high
  calculateWeeklyWinsForSeason = weeklyScoreDataForSeason => {
    return weeklyScoreDataForSeason.map(singleWeekScoreData =>
      singleWeekScoreData.map((teamScoreData, index) => ({
        wins: index,
        losses: singleWeekScoreData.length - 1 - index,
        id: teamScoreData.id,
        name: teamScoreData.name,
        outcome: teamScoreData.outcome
      }))
    );
  };

  getWeeklyScoreDataForSeason = async (leagueId, seasonId) => {
    let seasonData = [];
    var response = await axios.get(
      `https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`
    );
    const weeksInSeason = response.data.leaguesettings.regularSeasonMatchupPeriodCount;
    let allWeekScoresPromises = [];
    for (let i = 1; i <= weeksInSeason; i++) {
      allWeekScoresPromises.push(this.getWeekScores(leagueId, seasonId, i));
    }
    const allWeekScores = await Promise.all(allWeekScoresPromises);
    allWeekScores.forEach(weekScores => {
      weekScores.sort((a, b) => {
        return a.score - b.score;
      });
      seasonData.push(weekScores);
    });
    return seasonData;
  };

  getWeekScores = async (leagueId, seasonId, week) => {
    var response = await axios.get(
      `https://games.espn.com/ffl/api/v2/scoreboard?leagueId=${leagueId}&seasonId=${seasonId}&matchupPeriodId=${week}`
    );
    let matchups = response.data.scoreboard.matchups;
    return this.buildWeekScores(matchups);
  };

  buildWeekScores = matchups => {
    return flattenDeep(
      matchups
        .filter(matchup => {
          return matchup.bye || matchup.winner !== 'undecided';
        })
        .map(({ winner, teams, bye }) => {
          let results = teams.map(team => {
            return { ...team, outcome: bye ? 'BYE' : team.home === (winner === 'home') ? 'WIN' : 'LOSE' };
          });

          return results;
        })
    )
      .map(team => {
        return {
          id: team.teamId,
          score: team.score,
          name: `${team.team.teamLocation} ${team.team.teamNickname}`,
          outcome: team.outcome
        };
      })
      .filter(team => team.score !== 0);
  };

  addCookies = cookies => {
    axios.interceptors.request.use(
      config => {
        config.headers.Cookie = cookies;
        return config;
      },
      error => Promise.reject(error)
    );
  };
}
