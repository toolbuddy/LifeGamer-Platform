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
import Frame from "./components/Frame";
import Login from "./components/Login";

export default {
  name: "App",
  components: { Frame, Login },
  data: function() {
    return {
      hasCookie: false
    };
  },
  created: function() {
    this.checkCookie();
  },
  methods: {
    checkCookie: function() {
      this.hasCookie = this.$cookies.isKey("token");
    }
  }
};
</script>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/notosanstc.css);

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  font-family: "Noto Sans TC", "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
