const { authorizer } = require('./authorizer');
const { fetchSyncedAccountAuthentication, getSyncedAccountCookiesByEmail } = require('./fetchSyncedAccountAuthentication');

module.exports = {
  authorizer,
  fetchSyncedAccountAuthentication,
  getSyncedAccountCookiesByEmail
};
