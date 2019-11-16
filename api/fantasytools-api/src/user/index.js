const { addEmail } = require('./addEmail');
const { createUser } = require('./createUser');
const { getUser, getUserByEmail } = require('./getUser');
const { syncAccount } = require('./syncAccount');
const { onboarding } = require('./onboarding');

module.exports = {
  addEmail,
  createUser,
  getUser,
  getUserByEmail,
  syncAccount,
  onboarding
};
