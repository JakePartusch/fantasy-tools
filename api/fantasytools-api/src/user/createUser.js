import DynamoDB from 'aws-sdk/clients/dynamodb';
import uuidv4 from 'uuid/v4';
const dynamoDb = new DynamoDB.DocumentClient();

const createUser = async user => {
  await dynamoDb
    .put({
      TableName: process.env.USERS_TABLE,
      Item: {
        id: uuidv4(),
        ...user
      }
    })
    .promise();
};

module.exports.createUser = async event => {
  console.log(JSON.stringify(event, null, 2));
  const { body } = event;
  const { user } = JSON.parse(body);
  if (!user) {
    return { statusCode: 400 };
  }
  await createUser(user);
  return {
    statusCode: 201
  };
};
