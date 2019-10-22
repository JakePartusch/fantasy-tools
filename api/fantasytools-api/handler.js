const DynamoDB = require("aws-sdk/clients/dynamodb")
const uuidv4 = require('uuid/v4');
const dynamoDb = new DynamoDB.DocumentClient()

const addEmail = async (email) => {
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuidv4(),
        email,
      },
    })
    .promise()
}

module.exports.addEmail = async event => {
  console.log(JSON.stringify(event, null, 2))
  const { body } = event
  const { email } = JSON.parse(body)
  await addEmail(email)
  return {
    statusCode: 201,
  }
}
