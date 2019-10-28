const DynamoDB = require('aws-sdk/clients/dynamodb');
const uuidv4 = require('uuid/v4');
const dynamoDb = new DynamoDB.DocumentClient();

const getUserByEmail = async email => {
  const response = await dynamoDb
    .scan({
      TableName: process.env.DYNAMODB_TABLE,
      ExpressionAttributeValues: {
        ':email': email
      },
      FilterExpression: 'email = :email'
    })
    .promise();
  console.log(response);
  if (response.Items.length === 0) {
    throw new Error("User doesn't exist", email);
  }
  return response.Items[0];
};

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
