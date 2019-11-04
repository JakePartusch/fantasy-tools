const { authorizer, fetchSyncedAccountAuthentication } = require('./authentication');
const { fetchLeague, fetchLeagues } = require('./league');
const { addEmail, createUser, getUser, syncAccount } = require('./user');

module.exports = {
  authorizer,
  fetchSyncedAccountAuthentication,
  fetchLeague,
  fetchLeagues,
  addEmail,
  createUser,
  getUser,
  syncAccount
}