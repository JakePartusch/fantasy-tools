import axios from 'axios';
import { getSyncedAccountCookiesByEmail } from '../authentication';

const fetchLeague = async (email, leagueId, seasonId = '2019', forceRefresh = false) => {
  const { s2, swid } = await getSyncedAccountCookiesByEmail(email, forceRefresh);
  const cookieString = `espn_s2=${s2}; swid=${swid}`;
  try {
    const leagueResponse = await axios.get(
      `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchupScore&view=mStatus&view=mSettings&view=mTeam&view=modular&view=mNav`,
      { headers: { Cookie: cookieString } }
    );
    console.log(JSON.stringify(leagueResponse.data));
    return leagueResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 401 && !forceRefresh) {
      const league = await fetchLeague(email, leagueId, seasonId, true);
      return league;
    }
    throw error;
  }
};

module.exports.fetchLeague = async event => {
  console.log(JSON.stringify(event));
  const { email } = event.requestContext.authorizer;
  const { leagueId, seasonId } = event.pathParameters;
  try {
    const leagueData = await fetchLeague(email, leagueId, seasonId);
    return {
      statusCode: 200,
      body: JSON.stringify(leagueData)
    };
  } catch (e) {
    console.error('Unable to fetch leagues', e);
    if (e.message === 'No account synced') {
      return {
        statusCode: 404
      };
    }

    return {
      statusCode: 500
    };
  }
};
