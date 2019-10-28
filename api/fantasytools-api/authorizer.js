const jwt = require("jsonwebtoken")
const AUTH0_CLIENT_ID = "TgWF1KpB5VYAO05sAHC1Wsi4XXOdf6c4"
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

const generatePolicy = (principalId, email) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "*",
        },
      ],
    },
    context: {
      id: principalId,
      email
    },
  }
}

const authorizer = async event => {
  try {
    console.log(JSON.stringify(event, null, 2))
    const token = event.authorizationToken.replace("Bearer ", "")
    console.log(token)
    const options = {
      audience: AUTH0_CLIENT_ID,
    }
    console.log(AUTH0_CLIENT_ID)
    console.log(AUTH0_CLIENT_PUBLIC_KEY)
    const parsedToken = await new Promise((resolve, reject) => {
      jwt.verify(token, AUTH0_CLIENT_PUBLIC_KEY, options, (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(decoded)
        }
      })
    })
    console.log(JSON.stringify(parsedToken, null, 2))
    const policy = generatePolicy(parsedToken.sub, parsedToken.email)
    console.log(JSON.stringify(policy, null, 2))
    return policy
  } catch (e) {
    console.error(e)
    throw new Error("Unauthorized")
  }
}

module.exports.authorizer = authorizer