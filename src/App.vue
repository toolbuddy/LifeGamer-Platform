<template>
  <div id="app">
    <div v-if="token !== null">
      <div v-if="((!userdata.is_admin) ? false : userdata.is_admin) || serverStatus === 'on'">
        <Frame />
        <router-view></router-view>
      </div>
      <Maintain v-else></Maintain>
    </div>
    <Login v-else></Login>
  </div>
</template>

<script>
import Frame from '@/components/Frame'
import Login from '@/components/Login'
import Maintain from '@/components/Maintain'

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: { Frame, Login, Maintain },
  computed: {
    ...mapState('platform', ['token', 'serverStatus', 'userdata'])
  },
  created: function () {
    this.getCookieToken()
    this.getUserData()
    this.getServerStatus()
    this.$router.replace({ query: { edit: false } })
  },
  methods: {
    ...mapMutations('platform', ['getCookieToken']),
    ...mapActions('platform', ['getUserData', 'getServerStatus'])
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/notosanstc.css);

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#app {
  height: 100%;
  width: 100%;
  font-family: "Noto Sans TC", "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
