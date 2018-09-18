import Vue from 'vue'
import Router from 'vue-router'

/* import vue component */
import Announce from '@/components/Announce'
import BattleField from '@/components/BattleField'
import Resource from '@/components/Resource'
import Grade from '@/components/Grade'
import Commit from '@/components/Commit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'announce',
      component: Announce
    },
    {
      path: '/battle',
      name: 'battle',
      component: BattleField
    },
    {
      path: '/resource',
      name: 'resource',
      component: Resource
    },
    {
      path: '/grade',
      name: 'grade',
      component: Grade
    },
    {
      path: '/commit',
      name: 'commit',
      component: Commit
    }
  ]
})
