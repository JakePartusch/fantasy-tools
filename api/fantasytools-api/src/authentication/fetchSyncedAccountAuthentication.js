import KMS from 'aws-sdk/clients/kms';
import axios from 'axios';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { getUserByEmail } from '../user';
import dayjs from 'dayjs';
const kmsClient = new KMS();
const dynamoDb = new DynamoDB.DocumentClient();

const saveSession = async (user, sessionAttributes) => {
  console.log('Saving Session', user, sessionAttributes);
  const item = {
    ...user,
    session: {
      ...sessionAttributes,
      lastUpdatedTimestamp: new Date().toISOString()
    }
  };
  await dynamoDb
    .put({
      TableName: process.env.USERS_TABLE,
      Item: item
    })
    .promise();
};

const loginToEspn = async credentials => {
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
  return authenticationResponse;
};

const getSyncedAccountCookiesByEmail = async email => {
  const user = await getUserByEmail(email);
  if (
    user.session &&
    dayjs(user.session.lastUpdatedTimestamp).isAfter(dayjs().subtract(1, 'day'))
  ) {
    console.log('Using cached Session');
    return user.session;
  }
  const credentialsBlob = await kmsClient
    .decrypt({
      CiphertextBlob: Buffer.from(user.syncedAccount, 'base64')
    })
    .promise();
  const credentials = JSON.parse(credentialsBlob.Plaintext.toString('ascii'));
  const authenticationResponse = await loginToEspn(credentials);
  console.log(JSON.stringify(authenticationResponse.data));
  const sessionAttributes = {
    swid: authenticationResponse.data.data.profile.swid,
    s2: authenticationResponse.data.data.s2
  };
  await saveSession(user, sessionAttributes);
  return sessionAttributes;
};

module.exports = {
  fetchSyncedAccountAuthentication: async event => {
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
  },
  getSyncedAccountCookiesByEmail,
  loginToEspn
};
