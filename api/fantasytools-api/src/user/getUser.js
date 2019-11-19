import DynamoDB from 'aws-sdk/clients/dynamodb';
const dynamoDb = new DynamoDB.DocumentClient();

const getUserByEmail = async email => {
  const response = await dynamoDb
    .query({
      TableName: process.env.USERS_TABLE,
      IndexName: 'emailIndex',
      ExpressionAttributeValues: {
        ':email': email
      },
      KeyConditionExpression: 'email = :email'
    })
    .promise();
  console.log(response);
  if (response.Items.length === 0) {
    throw new Error("User doesn't exist", email);
  }
  return response.Items[0];
};

module.exports.getUser = async event => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(event.requestContext.authorizer));
  const { email } = event.requestContext.authorizer;
  const user = await getUserByEmail(email);
  console.log(JSON.stringify(user));
  return {
    statusCode: 200,
    body: JSON.stringify(user)
  };
};

module.exports.getUserByEmail = getUserByEmail;
