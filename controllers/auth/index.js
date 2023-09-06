const register = require('./register')
const login = require('./login')
const logout = require('./logout')
const current = require('./current')
const avatars = require('./avatars')
const verify = require('./verify')
const repeatverify = require('./repeatverify')

module.exports = {
    register,
    login,
    logout,
    current,
    avatars,
    verify,
    repeatverify
}