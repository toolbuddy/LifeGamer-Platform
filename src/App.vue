<template>
  <div id="app">
    <HeaderBar/>
    <router-view/>
    <Menu/>
  </div>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import Menu from "./components/Menu";

export default {
  name: "App",
  components: { Menu, HeaderBar },
  created() {
    let token = this.getCookie("token");
    if (token == "") {
      window.location.href = "https://hmkrl.com/auth";
    } else {
      console.log(token);
    }
  },
  methods: {
    /* cookie operating function */
    setCookie: function(cname, cvalue, exMin) {
      var d = new Date();
      /* cookie exist time */
      d.setTime(d.getTime() + exMin * 60 * 1000); // cookie exist exMin minutes
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    deleteCookie: function(cname) {
      document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
