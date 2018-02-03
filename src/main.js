// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

/* set header bar event */
function showMenu() {
  let menu = document.querySelector("#menu");
  menu.style.left = 0;
  window.addEventListener("click", hideMenu);
}

function hideMenu(event) {
  let menu = document.querySelector('aside[id="menu"]');
  let x = event.clientX;
  if (menu.style.left === "0px" && x > 250) {
    menu.style.left = "-250px";
    window.removeEventListener("click", hideMenu);
  }
}

function toggleHeaderBar() {
  let scrollY = window.scrollY;
  let headerbar = document.querySelector('header[id="headerbar"]');
  if (_scrollY < scrollY) {
    /* scroll down */
    headerbar.style.top = 0;
  } else if (scrollY == 0) {
    /* scroll to the top */
    headerbar.style.top = 0;
  } else {
    /* scroll up */
    headerbar.style.top = "-10%";
  }
  _scrollY = scrollY;
}

var MenuIcon = document.querySelector('li[id="MenuIcon"]');
MenuIcon.addEventListener("click", showMenu);

var _scrollY = 0;
window.addEventListener("scroll", toggleHeaderBar);
