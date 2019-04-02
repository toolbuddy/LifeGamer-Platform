const { pd2royaleDatabaseAPI } = require('./pd2royaleDatabaseAPI')
const { pd2sudokuDatabaseAPI } = require('./pd2sudokuDatabaseAPI')
const config = require('../../../config/setting')

var gameDatabaseAPI = null

/* using switch case to decide game database */
switch (config.gameModule) {
  case 'pd2royale':
    gameDatabaseAPI = pd2royaleDatabaseAPI
    break
  case 'pd2sudoku':
    gameDatabaseAPI = pd2sudokuDatabaseAPI
    break
  default: break
}

module.exports = { gameDatabaseAPI }
