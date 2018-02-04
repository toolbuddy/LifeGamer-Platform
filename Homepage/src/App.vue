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
  components: { Menu, HeaderBar }
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
