const { pd2royaleBattleField } = require('./pd2royale/pd2royaleBattleField')
const { pd2royaleWebsocket } = require('./pd2royale/pd2royaleWebsocket')

const { pd2sudokuBattleField } = require('./pd2sudoku/pd2sudokuBattleField')
const config = require('../../config/setting')

var gameModule = null
var gameWebsocket = null

/* using switch case to decide game database */
switch (config.gameModule) {
  case 'pd2royale':
    gameModule = new pd2royaleBattleField()
    gameWebsocket = new pd2royaleWebsocket()
    break
  case 'pd2sudoku':
    gameModule = new pd2sudokuBattleField()
    break
  default: break
}

module.exports = { gameModule, gameWebsocket }
