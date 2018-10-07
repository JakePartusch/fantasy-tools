import { FantasyFootballApi } from '../api/FantasyFootballApi';

export const handler = async(event, context, callback) => {
    console.log(event)
    const { queryStringParameters } = event;
    if(!queryStringParameters) {
        return {
            statusCode: 400,
        }
    }
    const { leagueId, seasonId } = queryStringParameters;
    const api = new FantasyFootballApi();
    const results = await api.getPowerRankings(leagueId, seasonId)
    return {
        statusCode: 200,
        body: JSON.stringify(results)
      }
  }