const { pd2royaleDatabaseAPI } = require('./pd2royaleDatabaseAPI')
const config = require('../../../config/config')[process.env.NODE_ENV]

var gameDatabaseAPI = null

/* using switch case to decide game database */
switch (config.gameDatabase) {
  case 'pd2royale':
    gameDatabaseAPI = pd2royaleDatabaseAPI
    break
  default: break
}

module.exports = { gameDatabaseAPI }