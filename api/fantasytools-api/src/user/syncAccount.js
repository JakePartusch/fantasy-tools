import DynamoDB from 'aws-sdk/clients/dynamodb';
import KMS from 'aws-sdk/clients/kms';
import axios from 'axios';
const dynamoDb = new DynamoDB.DocumentClient();
const kmsClient = new KMS();
import { getUserByEmail } from './getUser';

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

const syncAccount = async (email, credentials) => {
  const user = await getUserByEmail(email);
  const credentialsString = JSON.stringify(credentials);
  const params = {
    KeyId: '5a138b9f-ba41-42c7-afda-e8c7c7ec9830',
    Plaintext: credentialsString
  };

  const encryptedCredentials = await kmsClient.encrypt(params).promise();
  user.syncedAccount = encryptedCredentials.CiphertextBlob.toString('base64');
  user.session = undefined;
  await dynamoDb
    .put({
      TableName: process.env.USERS_TABLE,
      Item: {
        ...user
      }
    })
    .promise();
};

//No logging to avoid storing credentials in plaintext
module.exports.syncAccount = async event => {
  const { body } = event;
  const credentials = JSON.parse(body);
  const { email } = event.requestContext.authorizer;
  try {
    await loginToEspn(credentials);
  } catch (e) {
    console.error('Unable to login with provided credentials', e);
    return {
      statusCode: 403
    };
  }
  await syncAccount(email, credentials);
  return {
    statusCode: 200
  };
};
