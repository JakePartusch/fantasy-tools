import { FantasyFootballApi } from '../api/FantasyFootballApi';

export const handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const { s2, swid, leagueId, seasonId } = body;
        const api = new FantasyFootballApi();
        
        if(s2 && swid) {
            const cookies = `espn_s2=${s2}; SWID=${swid};`
            api.addCookies(cookies);
        }
        const results = await api.getPowerRankings(leagueId, seasonId)
        return {
            statusCode: 200,
            body: JSON.stringify(results)
        }
    } catch(e) {
        if(e && e.response && e.response.status === 401) {
            return {
                statusCode: 401,
                body: JSON.stringify({errorMessage: "Unable to retrieve private league power rankings"})
            }
        }
        console.error("Unable to retrieve power rankings", e);
        return {
            statusCode: 500,
            body: JSON.stringify({errorMessage: "Unable to retrieve power rankings"})
        }
    }
  }