// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

/* vue cookies */
const vueCookies = require("vue-cookies");
Vue.use(vueCookies);

/* vue resource */
const vueResource = require("vue-resource");
Vue.use(vueResource.default);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
