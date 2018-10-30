const axios = require('axios')
const config = require('../../../config/config')[process.env.NODE_ENV]

export default {
  namespaced: true,
  state: {
    hostname: config.hostname,
    projectName: config.projectName,
    gameModule: config.gameModule,
    userdata: null,
    token: null,
    serverStatus: 'off',
    asideMenuCollapse: 0,
    editMode: 0
  },
  getters: {
    /**
     * getting user is admin or not
     *
     * @param {Object} state - vuex store state
     */
    isAdmin (state) {
      return (!state.userdata) ? false : state.userdata.is_admin
    }
  },
  mutations: {
    /**
     * Getting cookie token and saving into state
     *
     * @param {Object} state - vuex store state
     */
    getCookieToken (state) {
      var v = document.cookie.match('(^|;) ?token=([^;]*)(;|$)')
      state.token = v ? (v[2] === '' ? null : v[2]) : null
    },
    /**
     * Remove cookie token and clean store state token value
     *
     * @param {Object} state - vuex store state
     */
    removeCookieToken (state) {
      document.cookie = 'token=;path=/;expires=-1'
      state.token = null
    },
    /**
     * Updating user data
     *
     * @param {Object} state - vuex store state
     * @param {Object} userdata - user data getting from gitlab api
     */
    updateUserData (state, userdata) {
      state.userdata = userdata
    },
    /**
     * Setting server status
     *
     * @param {Object} state - vuex store state
     * @param {string} status - 'on' or 'off'
     */
    setServerStatus (state, status) {
      state.serverStatus = status
    },
    /**
     * show aside menu
     *
     * @param {Object} state - vuex store state
     */
    showAsideMenu (state) {
      state.asideMenuCollapse = 1
      window.addEventListener('click', this.hideAsideMenu)
    },
    /**
     * hide aside menu
     *
     * @param {Object} state - vuex store state
     */
    hideAsideMenu (state) {
      if (state.asideMenuCollapse && window.event.clientX > 250) {
        state.asideMenuCollapse = 0
        window.removeEventListener('click', this.hideAsideMenu)
      }
    },
    /**
     * Toggle edit mode(only admin)
     *
     * @param {Object} state - vuex store state
     */
    editModeToggle (state) {
      state.editMode ^= 1
    }
  },
  actions: {
    /**
     * method for user logout
     *
     * @param {Object} context - vuex store context
     */
    logout (context) {
      axios.get(`${config.hostname}/gitlab/users/sign_out`).then(() => {
        context.commit('removeCookieToken')
        window.location.reload()
      })
    },
    /**
     * getting user data
     *
     * @param {Object} context - vuex store context
     */
    getUserData (context) {
      if (context.state.token) {
        axios.get(`${config.hostname}/userData?token=${context.state.token}`).then((response) => {
          context.commit('updateUserData', response.data)
        })
      }
    },
    /**
     * getting server status
     *
     * @param {Object} context - vue store context
     */
    getServerStatus (context) {
      axios.get(`${config.hostname}/serverStatus`).then((response) => {
        context.commit('setServerStatus', response.data)
      })
    }
  }
}
