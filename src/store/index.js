import Vue from 'vue'
import Vuex from 'vuex'

import platform from './modules/platform'
import judge from './modules/judge'
import grade from './modules/grade'
import gameBattleField from './modules/gameBattleField/gameBattleField'
import gameJudge from './modules/gameJudge/gameJudge'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    platform,
    judge,
    gameJudge,
    grade,
    gameBattleField
  }
})
