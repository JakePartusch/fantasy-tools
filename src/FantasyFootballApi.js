import axios from 'axios';
import cheerio from 'cheerio';


export const getPowerRankings = async (leagueId, seasonId, weeksInSeason) => {
    const weeklyScoreDataForSeason = await getWeeklyScoreDataForSeason(leagueId, seasonId, weeksInSeason);
    const weeklyWinsForSeason = calculateWeeklyWinsForSeason(weeklyScoreDataForSeason);
    return calculateSeasonWinTotal(weeklyWinsForSeason);
}

export const getUserData = async (leagueId, seasonId) => {
    var response = await axios.get(`http://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
    return Object.values(response.data.leaguesettings.teams).map(team => (
        {
            id: team.teamId,
            logoUrl: team.logoUrl ? team.logoUrl: "http://www.freeiconspng.com/uploads/clipart--person-icon--cliparts-15.png",
            owner: `${team.owners[0].firstName} ${team.owners[0].lastName}`,
            name: `${team.teamLocation} ${team.teamNickname}`
        }
    ))
}

const calculateSeasonWinTotal = (weeklyWinsForSeason) => {
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
const calculateWeeklyWinsForSeason = (weeklyScoreDataForSeason) => {
    return weeklyScoreDataForSeason
            .map(singleWeekScoreData => singleWeekScoreData
                .map((teamScoreData, index) => ({
                    wins: index,
                    losses: singleWeekScoreData.length - 1 - index,
                    id: teamScoreData.id,
                    name: teamScoreData.name
                })))
}

const getWeeklyScoreDataForSeason = async (leagueId, seasonId, weeksInSeason) => {
    let seasonData = [];
    for (let i = 1; i<= weeksInSeason; i++) {
        const weekScores = await getWeekScores(leagueId, seasonId, i)
        weekScores.sort((a, b) => { 
            return a.score - b.score;
        });
        seasonData.push(weekScores);
    }
    return seasonData;
}

const getWeekScores = async (leagueId, seasonId, week) => {
    var response = await axios.get(`http://games.espn.com/ffl/api/v2/scoreboard?leagueId=${leagueId}&seasonId=${seasonId}&matchupPeriodId=${week}`);
    let matchups = response.data.scoreboard.matchups;
    return matchups
        .reduce((acc, matchup) => acc.concat(matchup.teams), [])
        .map(team => ({
            id: team.teamId, 
            score: team.score,
            name: `${team.team.teamLocation} ${team.team.teamNickname}`
        }))
        .filter(team => team.score != 0);
}

