const KMS = require('aws-sdk/clients/kms');
const axios = require('axios');
const kmsClient = new KMS();
const { getUserByEmail } = require('../user');

const getSyncedAccountCookiesByEmail = async email => {
  const user = await getUserByEmail(email);
  const credentialsBlob = await kmsClient
    .decrypt({
      CiphertextBlob: Buffer.from(user.syncedAccount, 'base64')
    })
    .promise();
  const credentials = JSON.parse(credentialsBlob.Plaintext.toString('ascii'));
  const apiKeyResponse = await axios.post(
    'https://registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/api-key?langPref=en-US',
    null,
    { headers: { accept: 'application/json' } }
  );
  const apiKey = apiKeyResponse.headers['api-key'];
  const authenticationResponse = await axios.post(
    'https://registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/guest/login?langPref=en-US',
    { loginValue: credentials.username, password: credentials.password },
    { headers: { 'Content-Type': 'application/json', Authorization: `APIKEY ${apiKey}` } }
  );
  console.log(JSON.stringify(authenticationResponse.data));
  return {
    swid: authenticationResponse.data.data.profile.swid,
    s2: authenticationResponse.data.data.s2
  };
};

module.exports.fetchSyncedAccountAuthentication = async event => {
  const { email } = event.requestContext.authorizer;
  try {
    const cookies = await getSyncedAccountCookiesByEmail(email);
    return {
      statusCode: 200,
      body: JSON.stringify(cookies)
    };
  } catch (e) {
    console.error('Unable to fetch auth data', e);
    return {
      statusCode: 500
    };
  }
};

module.exports.getSyncedAccountCookiesByEmail = getSyncedAccountCookiesByEmail;
