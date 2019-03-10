const config = require('../../../../config/config')[process.env.NODE_ENV]
const pd2royaleBattleField = require('./pd2royaleBattleField').default

var gameBattleField = null

switch (config.gameModule) {
  case 'pd2royale':
    gameBattleField = pd2royaleBattleField
    break
  default:
    gameBattleField = pd2royaleBattleField
    break
}

export default gameBattleField
