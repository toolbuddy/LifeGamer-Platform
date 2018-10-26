const config = require('../../../../config/config')[process.env.NODE_ENV]
const pd2royaleJudge = require('./pd2royaleJudge')

var gameJudge = null

switch (config.gameModule) {
  case 'pd2royale':
    gameJudge = pd2royaleJudge
    break
  default: break
}

module.exports = { gameJudge }
