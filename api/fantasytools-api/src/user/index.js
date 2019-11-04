const { addEmail } = require('./addEmail');
const { createUser } = require('./createUser');
const { getUser, getUserByEmail } = require('./getUser');
const { syncAccount } = require('./syncAccount');

module.exports = {
    addEmail,
    createUser,
    getUser,
    getUserByEmail,
    syncAccount
}