const axios = require('axios');
const { getSyncedAccountCookiesByEmail } = require('../authentication');

const fetchLeague = async (email, leagueId, seasonId = '2019') => {
  const { s2, swid } = await getSyncedAccountCookiesByEmail(email);
  const cookieString = `espn_s2=${s2}; swid=${swid}`;
  const leagueResponse = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchupScore&view=mStatus&view=mSettings&view=mTeam&view=modular&view=mNav`,
    { headers: { Cookie: cookieString } }
  );
  console.log(JSON.stringify(leagueResponse.data));
  return leagueResponse.data;
};

module.exports.fetchLeague = async event => {
  console.log(JSON.stringify(event));
  const { email } = event.requestContext.authorizer;
  const { leagueId, seasonId } = event.pathParameters;
  const leagueData = await fetchLeague(email, leagueId, seasonId);
  return {
    statusCode: 200,
    body: JSON.stringify(leagueData)
  };
};
