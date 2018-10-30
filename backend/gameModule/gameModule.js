const { pd2royaleBattleField } = require('./pd2royale/pd2royaleBattleField')
const { pd2royaleWebsocket } = require('./pd2royale/pd2royaleWebsocket')
const config = require('../../config/config')[process.env.NODE_ENV]

var gameModule = null
var gameWebsocket = null

/* using switch case to decide game database */
switch (config.gameModule) {
  case 'pd2royale':
    gameModule = new pd2royaleBattleField()
    gameWebsocket = new pd2royaleWebsocket()
    break
  default: break
}

module.exports = { gameModule, gameWebsocket }
