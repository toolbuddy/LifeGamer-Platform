const { pd2royaleBattleField } = require('./pd2royaleBattleField')
const config = require('../../config/config')[process.env.NODE_ENV]

var gameModule = null

/* using switch case to decide game database */
switch (config.gameDatabase) {
  case 'pd2royale':
    gameModule = new pd2royaleBattleField()
    break
  default: break
}

module.exports = { gameModule }