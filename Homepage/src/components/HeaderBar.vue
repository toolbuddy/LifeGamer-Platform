<!-- html part -->
<template>
  <header id="headerbar">
      <ul class="headerbar-menu-wrapper">
            <li id="MenuIcon" class="headerbar-menu menuicon-wrapper">
                <img class="menu-icon" src="../assets/menu.svg" />
            </li>
            <li class="headerbar-menu">
                <img class="logo" src="../assets/logo.svg" />
            </li>
            <li class="headerbar-menu" v-for="item in list" :key="item.id">
              {{ item.value }}
            </li>
        </ul>
  </header>
</template>

<!-- javascript part -->
<script>
const list = [
  {
    value: "Announce"
  },
  {
    value: "Demo Time"
  },
  {
    value: "Battle Field"
  },
  {
    value: "Resources"
  }
];

export default {
  name: "HeaderBar",
  data: function() {
    return {
      list: list
    };
  }
};
</script>

<!-- css part -->
<style scope>
:root {
  --fullWidth: 100%;
  --headerbar-height: 9%;
  --headerbar-color: #009688;
  --headerbar-hover-color: #006d70;
}
#headerbar {
  width: var(--fullWidth);
  height: var(--headerbar-height);
  background: var(--headerbar-color);
  color: white;
  position: fixed;
  /* set position */
  top: 0;
  left: 0;
  transition: all 0.5s ease;
}

.headerbar-menu-wrapper {
  margin: 0;
  padding: 0;
  list-style: none;
  width: var(--fullWidth);
  height: 100%;
}

.headerbar-menu {
  padding: 5px 20px;
  box-sizing: border-box;
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.headerbar-menu:hover {
  cursor: pointer;
  background: var(--headerbar-hover-color);
}

.logo {
  height: 85%;
}

.menu-icon {
  height: 50%;
}
</style>
