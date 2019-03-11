const config = require('../../../../config/config')[process.env.NODE_ENV]
const pd2royaleBattleField = require('./pd2royaleBattleField').default
const pd2sudokuBattleField = require('./pd2sudokuBattleField').default

var gameBattleField = null

switch (config.gameModule) {
  case 'pd2royale':
    gameBattleField = pd2royaleBattleField
    break
  case 'pd2sudoku':
    gameBattleField = pd2sudokuBattleField
    break
  default: break
}

export default gameBattleField
