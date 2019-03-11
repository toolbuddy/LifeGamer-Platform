const config = require('../../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    ws: 'None',
    level1: 'pending.....',
    level2: 'pending.....',
    level3: 'pending.....',
    level4: 'pending.....'
  },
  getters: {
    JudgeProcess: function (state) { return (level) => state[level] }
  },
  mutations: {
    /**
     * assign websocket
     *
     * @param {Object} state - vuex store state
     * @param {Object} ws - websocket object
     */
    assignWebSocket: function (state, ws) { state.ws = ws },
    /**
     * assign Judge process
     *
     * @param {Object} state - vuex store state
     * @param {Object} param - contains level and data
     */
    updateJudgeProcess: function (state, param) { state[param.level] = param.data }
  },
  actions: {
    /**
     * function that create websocket and connect to server
     *
     * @param {Object} context - vuex store context
     * @param {string} token - user's gitlab access token
     */
    createWebSocket: function (context, token) {
      var wss = new WebSocket(config.ws_url)
      wss.onopen = function () { wss.send(JSON.stringify({method: 'register', token: token})) }
      wss.onclose = function () { wss.send(JSON.stringify({method: 'unregister', token: token})) }
      wss.onmessage = function (evt) {
        context.commit('updateJudgeProcess', JSON.parse(evt.data))
      }
      context.commit('assignWebSocket', wss)
    }
  }
}
