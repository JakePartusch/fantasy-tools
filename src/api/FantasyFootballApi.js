import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import tough from 'tough-cookie';

export class FantasyFootballApi {
    constructor() {
        axiosCookieJarSupport(axios);
        const cookieJar = new tough.CookieJar();

        axios.defaults.jar = cookieJar;
        axios.defaults.withCredentials = true;
    }

    getPowerRankings = async (leagueId, seasonId) => {
        const weeklyScoreDataForSeason = await this.getWeeklyScoreDataForSeason(leagueId, seasonId);
        const weeklyWinsForSeason = this.calculateWeeklyWinsForSeason(weeklyScoreDataForSeason);
        return this.calculateSeasonWinTotal(weeklyWinsForSeason);
    }

    getUserData = async (leagueId, seasonId) => {
        var response = await axios.get(`https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
        return Object.values(response.data.leaguesettings.teams).map(team => (
            {
                id: team.teamId,
                logoUrl: team.logoUrl ? team.logoUrl: "https://www.freeiconspng.com/uploads/clipart--person-icon--cliparts-15.png",
                owner: `${team.owners[0].firstName} ${team.owners[0].lastName}`,
                name: `${team.teamLocation} ${team.teamNickname}`
            }
        ))
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
        for (let i = 1; i <= weeksInSeason; i++) {
            const weekScores = await this.getWeekScores(leagueId, seasonId, i)
            weekScores.sort((a, b) => { 
                return a.score - b.score;
            });
            seasonData.push(weekScores);
        }
        return seasonData;
    }

    getWeekScores = async (leagueId, seasonId, week) => {
        var response = await axios.get(`http:s//games.espn.com/ffl/api/v2/scoreboard?leagueId=${leagueId}&seasonId=${seasonId}&matchupPeriodId=${week}`);
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
}

