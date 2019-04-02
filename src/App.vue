<template>
  <div id="app">
    <div v-if="token !== null">
      <div v-if="hasLoadedData && (isAdmin || serverStatus === 'on')">
        <HeadBar />
        <AsideMenu />
        <router-view></router-view>
      </div>
      <Maintain v-else></Maintain>
    </div>
    <Login v-else></Login>
  </div>
</template>

<script>
import HeadBar from '@/components/HeadBar'
import Login from '@/components/Login'
import Maintain from '@/components/Maintain'
import AsideMenu from '@/components/AsideMenu'

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { HeadBar, Login, Maintain, AsideMenu },
  computed: {
    ...mapState('platform', ['token', 'serverStatus', 'userdata']),
    ...mapGetters('platform', ['isAdmin']),
    hasLoadedData () {
      return this.userdata !== null
    }
  },
  created: function () {
    this.getCookieToken()
    this.getUserData()
    this.getServerStatus()
  },
  methods: {
    ...mapMutations('platform', ['getCookieToken']),
    ...mapActions('platform', ['getUserData', 'getServerStatus'])
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/notosanstc.css);

:root {
  --login-button-color: #333;
  --login-button-hover-color: #666;
  --fullWidth: 100%;
  --headerbar-height: 48px;
  --headerbar-color: #009688;
  --headerbar-hover-color: #006d70;
  --menu-background-color: #006d70;
  --menu-width: 250px;
}

html,
body {
  margin: 0 auto;
}

#app {
  font-family: "Noto Sans TC", "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
