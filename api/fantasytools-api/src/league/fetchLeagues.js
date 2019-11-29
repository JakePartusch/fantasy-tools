import axios from 'axios';
import { getSyncedAccountCookiesByEmail } from '../authentication';

const fetchLeagues = async (email, forceRefresh = false) => {
  const { s2, swid } = await getSyncedAccountCookiesByEmail(email, forceRefresh);
  const cookieString = `espn_s2=${s2}; swid=${swid}`;
  try {
    const leaguesResponse = await axios.get(`https://fan.api.espn.com/apis/v2/fans/${swid}`, {
      headers: { Cookie: cookieString }
    });
    console.log(JSON.stringify(leaguesResponse.data));
    return leaguesResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 401 && !forceRefresh) {
      const leagues = await fetchLeagues(email, true);
      return leagues;
    }
    throw error;
  }
};

module.exports.fetchLeagues = async event => {
  console.log(JSON.stringify(event));
  const { email } = event.requestContext.authorizer;
  try {
    const leagues = await fetchLeagues(email);
    return {
      statusCode: 200,
      body: JSON.stringify(leagues)
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
