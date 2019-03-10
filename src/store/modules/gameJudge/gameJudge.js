const config = require('../../../../config/config')[process.env.NODE_ENV]
const pd2royaleJudge = require('./pd2royaleJudge').default
const pd2sudokuJudge = require('./pd2sudokuJudge').default

var gameJudge = null

switch (config.gameModule) {
  case 'pd2royale':
    gameJudge = pd2royaleJudge
    break
  case 'pd2sudoku':
    gameJudge = pd2sudokuJudge
    break
  default:
    break
}

export default gameJudge
