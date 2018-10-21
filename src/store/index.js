import Vue from 'vue'
import Vuex from 'vuex'

import platform from './modules/platform'
import judge from './modules/judge'
import grade from './modules/grade'
import battlefield from './modules/battlefield'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    platform,
    judge,
    grade,
    battlefield
  }
})
