import Vue from "vue";
import Router from "vue-router";

import Announce from "@/components/Announce";
import DemoTime from "@/components/DemoTime";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Announce
    },
    {
      path: "/demotime",
      component: DemoTime
    }
  ]
});
