const { databaseAPI } = require('./databaseAPI')
const { gitlabAPI } = require('./gitlabAPI')
const { gameDatabaseAPI } = require('./GameDatabase/gameDatabaseAPI')

module.exports = { gitlabAPI, databaseAPI, gameDatabaseAPI }