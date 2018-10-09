import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import tough from 'tough-cookie';
import { values, cloneDeep } from 'lodash';

export class FantasyFootballApi {
    constructor() {
        axiosCookieJarSupport(axios);
        const cookieJar = new tough.CookieJar();

        axios.defaults.jar = cookieJar;
        axios.defaults.withCredentials = true;
    }

    getPowerRankings = async (leagueId, seasonId) => {
        const userData = await this.getUserData(leagueId, seasonId);
        let weeklyWins = await this.getWeeklyWinsForSeason(leagueId, seasonId)
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
                    weeklyWinData : winData && winData.wins + winData.losses > 0 ? team.weeklyWinData.push(winData): team.weeklyWinData,
                    ...team
                }
            })
        });
        return rankings;
    }
    
    getWeeklyWinsForSeason = async (leagueId, seasonId) => {
        const weeklyScoreDataForSeason = await this.getWeeklyScoreDataForSeason(leagueId, seasonId);
        return this.calculateWeeklyWinsForSeason(weeklyScoreDataForSeason);
    }

    getUserData = async (leagueId, seasonId) => {
        var response = await axios.get(`https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
        return values(response.data.leaguesettings.teams).map(team => (
            {
                id: team.teamId,
                logoUrl: team.logoUrl ? team.logoUrl: "https://openclipart.org/image/2400px/svg_to_png/202776/pawn.png",
                owner: `${team.owners[0].firstName} ${team.owners[0].lastName}`,
                name: `${team.teamLocation} ${team.teamNickname}`,
                overallWins: team.record.overallWins,
                overallLosses: team.record.overallLosses,
                overallStanding: team.overallStanding
            }
        ))
    }

    getLeagueData = async (leagueId, seasonId) => {
        var response = await axios.get(`https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
        return {
            name: response.data.leaguesettings.name
        }
    }

    calculateSeasonWinTotal = (weeklyWinsForSeason) => {
        let seasonTotal = [];
        weeklyWinsForSeason.forEach(weekWins => {
            weekWins.forEach(team => {
                if(seasonTotal.find(seasonTotalTeam => seasonTotalTeam.id === team.id)) {
                    let element = seasonTotal.find(seasonTotalTeam => seasonTotalTeam.id === team.id);
                    seasonTotal[seasonTotal.indexOf(element)].wins += team.wins;
                    seasonTotal[seasonTotal.indexOf(element)].losses += team.losses  
                } else {
                    seasonTotal.push(team)
                }
            })
        });
        seasonTotal.sort((a, b) => { 
            return b.wins - a.wins;
        });
        return seasonTotal;
    }

    //Given the weekly score data is already sorted by score from low -> high
    calculateWeeklyWinsForSeason = (weeklyScoreDataForSeason) => {
        return weeklyScoreDataForSeason
                .map(singleWeekScoreData => singleWeekScoreData
                    .map((teamScoreData, index) => ({
                        wins: index,
                        losses: singleWeekScoreData.length - 1 - index,
                        id: teamScoreData.id,
                        name: teamScoreData.name
                    })))
    }

    getWeeklyScoreDataForSeason = async (leagueId, seasonId) => {
        let seasonData = [];
        var response = await axios.get(`https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
        const weeksInSeason = response.data.leaguesettings.regularSeasonMatchupPeriodCount;
        let allWeekScoresPromises = [];
        for (let i = 1; i <= weeksInSeason; i++) {
            allWeekScoresPromises.push(this.getWeekScores(leagueId, seasonId, i)) 
        }
        const allWeekScores = await Promise.all(allWeekScoresPromises);
        allWeekScores.forEach(weekScores => {
            weekScores.sort((a, b) => { 
                return a.score - b.score;
            });
            seasonData.push(weekScores);
        })
        return seasonData;
    }

    getWeekScores = async (leagueId, seasonId, week) => {
        var response = await axios.get(`https://games.espn.com/ffl/api/v2/scoreboard?leagueId=${leagueId}&seasonId=${seasonId}&matchupPeriodId=${week}`);
        let matchups = response.data.scoreboard.matchups;
        return matchups
            .filter(matchup => matchup.winner !== 'undecided' || matchup.bye )
            .reduce((acc, matchup) => acc.concat(matchup.teams), [])
            .map(team => ({
                id: team.teamId, 
                score: team.score,
                name: `${team.team.teamLocation} ${team.team.teamNickname}`
            }))
            .filter(team => team.score !== 0);
    }

    addCookies = cookies => {
        axios.interceptors.request.use(
            config => {
              config.headers.Cookie = cookies;
              return config;
            },
            error => Promise.reject(error)
          );
      }
}

