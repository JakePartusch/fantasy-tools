import { FantasyFootballApi } from '../api/FantasyFootballApi';

export const handler = async event => {
    try {
        const { queryStringParameters } = event;
        if(!queryStringParameters) {
            return {
                statusCode: 400,
                body: JSON.stringify({ errorMessage: "Invalid request parameters" })
            }
        }
        const { leagueId, seasonId } = queryStringParameters;
        const api = new FantasyFootballApi();
        const results = await api.getPowerRankings(leagueId, seasonId)
        return {
            statusCode: 200,
            body: JSON.stringify(results)
        }
    } catch(e) {
        console.error("Unable to retrieve power rankings", e);
        return {
            statusCode: 500,
            body: JSON.stringify({errorMessage: "Unable to retrieve power rankings"})
        }
    }
  }