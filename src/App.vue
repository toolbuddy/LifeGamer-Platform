<template>
  <div id="app">
    <div id="content" v-if="hasCookie">
      <Frame/>
      <router-view></router-view>
    </div>
    <div id="login" v-else>
      <Login/>
    </div>
  </div>
</template>

<script>
import Frame from './components/Frame'
import Login from './components/Login'

export default {
  name: 'App',
  components: { Frame, Login },
  data: function () {
    return {
      hasCookie: false
    }
  },
  created: function () {
    this.checkCookie()
    this.$router.replace({ query: { edit: false } })
  },
  methods: {
    checkCookie: function () {
      this.hasCookie = this.$cookies.isKey('token')
    }
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

#login {
  width: 100%;
  height: 100%;
}
</style>
