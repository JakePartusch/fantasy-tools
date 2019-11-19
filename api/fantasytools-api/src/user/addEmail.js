import DynamoDB from 'aws-sdk/clients/dynamodb';
import uuidv4 from 'uuid/v4';
const dynamoDb = new DynamoDB.DocumentClient();

const addEmail = async email => {
  await dynamoDb
    .put({
      TableName: process.env.USERS_TABLE,
      Item: {
        id: uuidv4(),
        email
      }
    })
    .promise();
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
