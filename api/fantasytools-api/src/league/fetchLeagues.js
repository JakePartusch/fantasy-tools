import axios from 'axios';
import { getSyncedAccountCookiesByEmail } from '../authentication';

const fetchLeagues = async email => {
  const { s2, swid } = await getSyncedAccountCookiesByEmail(email);
  const cookieString = `espn_s2=${s2}; swid=${swid}`;
  const leaguesResponse = await axios.get(`https://fan.api.espn.com/apis/v2/fans/${swid}`, {
    headers: { Cookie: cookieString }
  });
  console.log(JSON.stringify(leaguesResponse.data));
  return leaguesResponse.data;
};

module.exports.fetchLeagues = async event => {
  console.log(JSON.stringify(event));
  const { email } = event.requestContext.authorizer;
  const leagues = await fetchLeagues(email);
  return {
    statusCode: 200,
    body: JSON.stringify(leagues)
  };
};
