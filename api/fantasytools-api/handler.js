const DynamoDB = require('aws-sdk/clients/dynamodb');
const uuidv4 = require('uuid/v4');
const dynamoDb = new DynamoDB.DocumentClient();

const addEmail = async email => {
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuidv4(),
        email
      }
    })
    .promise();
};

const createUser = async user => {
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
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

module.exports.addEmail = async event => {
  console.log(JSON.stringify(event, null, 2));
  const { body } = event;
  const { email } = JSON.parse(body);
  if (!email) {
    return {
      statusCode: 400
    };
  }
  await addEmail(email);
  return {
    statusCode: 201
  };
};
