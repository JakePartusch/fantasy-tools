const DynamoDB = require('aws-sdk/clients/dynamodb');
const KMS = require('aws-sdk/clients/kms');
const dynamoDb = new DynamoDB.DocumentClient();
const kmsClient = new KMS();
const { getUserByEmail } = require('./getUser');


const syncAccount = async (email, credentials) => {
  const user = await getUserByEmail(email);
  const credentialsString = JSON.stringify(credentials);
  const params = {
    KeyId: '5a138b9f-ba41-42c7-afda-e8c7c7ec9830',
    Plaintext: credentialsString
  };

  const encryptedCredentials = await kmsClient.encrypt(params).promise();
  user.syncedAccount = encryptedCredentials.CiphertextBlob.toString('base64');
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
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
  await syncAccount(email, credentials);
  return {
    statusCode: 200
  };
};
