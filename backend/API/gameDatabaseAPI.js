const { pd2royaleDatabaseAPI } = require('./pd2royaleDatabaseAPI')
const config = require('../../config/config')[process.env.NODE_ENV]
var gameDatabaseAPI = config.gameDatabase

module.exports = { gameDatabaseAPI }