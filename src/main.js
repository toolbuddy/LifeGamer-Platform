// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

/* vuex */
Vue.use(Vuex)

/* vue cookies */
const vueCookies = require('vue-cookies')
Vue.use(vueCookies)

/* vue resource */
const vueResource = require('vue-resource')
Vue.use(vueResource.default)

Vue.config.devtools = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App)
})
