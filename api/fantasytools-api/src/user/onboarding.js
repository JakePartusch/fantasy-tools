import DynamoDB from 'aws-sdk/clients/dynamodb';
import { getUserByEmail } from './getUser';
const dynamoDb = new DynamoDB.DocumentClient();

const onboarding = async email => {
  const user = await getUserByEmail(email);
  user.isOnboardingComplete = true;
  await dynamoDb
    .put({
      TableName: process.env.USERS_TABLE,
      Item: user
    })
    .promise();
};

module.exports.onboarding = async event => {
  try {
    console.log(JSON.stringify(event, null, 2));
    const { email } = event.requestContext.authorizer;
    await onboarding(email);
    return {
      statusCode: 200
    };
  } catch (e) {
    console.error('Unable to update onboarding', e);
    return {
      statusCode: 500
    };
  }
};
