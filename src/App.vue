<template>
  <div id="app">
    <div id="content" v-if="hasCookie">
      <div v-if="platformUse">
        <Frame />
        <router-view></router-view>
      </div>
      <Maintain v-else></Maintain>
    </div>
    <div id="login" v-else>
      <Login/>
    </div>
  </div>
</template>

<script>
import Frame from '@/components/Frame'
import Login from '@/components/Login'
import Maintain from '@/components/Maintain'

const config = require('../config/config')[process.env.NODE_ENV]

export default {
  name: 'App',
  components: { Frame, Login, Maintain },
  data: function () {
    return {
      hasCookie: false,
      serverStatus: 'on',
      is_admin: true
    }
  },
  computed: {
    platformUse: function () {
      return this.is_admin || this.serverStatus === 'on'
    }
  },
  created: function () {
    this.checkCookie()
    this.getServerStatus()
    this.checkAdmin()
    this.$router.replace({ query: { edit: false } })
  },
  methods: {
    checkCookie: function () {
      this.hasCookie = this.$cookies.isKey('token')
    },
    getServerStatus: function () {
      if (this.hasCookie) {
        this.$http.get(`${config.hostname}/serverStatus`).then(response => {
          this.serverStatus = response.body
        })
      }
    },
    checkAdmin: function () {
      if (this.hasCookie) {
        let cookie = this.$cookies.get('token')
        this.$http
          .get(`${config.hostname}/gitlab/api/v4/user?access_token=${cookie}`)
          .then(response => {
            this.is_admin = response.body.is_admin
          })
      }
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
