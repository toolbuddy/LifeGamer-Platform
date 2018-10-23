<template>
  <header id="headerbar">
    <ul class="headerbar-menu-wrapper">
      <li id="MenuIcon" class="headerbar-menu menuicon-wrapper" @click="showAsideMenu">
        <img class="menu-icon" src="../assets/menu.svg" />
      </li>
      <router-link class="headerbar-menu link" :to="{ name: 'announce' }">
        <img class="logo" src="../assets/logo.svg" />
      </router-link>
      <router-link class="headerbar-menu link headerbar-desktop" :to="{ name: item.path }" v-for="item in headerlist" :key="item.id" >
        {{ item.value }}
      </router-link>
      <li class="headerbar-menu headerbar-derktop" v-if="userdata.is_admin" @click="editModeToggle" :style="{ 'background-color': editMode ? '#006d70' : '#009688' }">
        <img class="menu-icon" :style="{ transform: `rotate(${editMode * -30}deg )` }" src="../assets/cog.svg" />
      </li>
      <li class="headerbar-menu headerbar-mobile" @click="headerbarToggle">
        <img id="arrow" class="menu-icon" src="../assets/arrow_down.svg" :style="{ transform: `rotate( ${mobileHeaderbarOpen * 180}deg)` }"/>
      </li>
    </ul>
    <!-- The components here only show in mobile service -->
    <ul class="headerbar-mobile-menu" :style="{ display: mobileHeaderbarOpen ? 'flex' : 'none' }">
      <router-link class="link headerbar-mobile-menu-item" :to="{ name: item.path }" v-for="item in headerlist" :key="item.id">
        {{ item.value }}
      </router-link>
    </ul>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HeadBar',
  data: function () {
    return {
      mobileHeaderbarOpen: false,
      headerlist: [{ value: 'Battle Field', path: 'battle' }, { value: 'Resources', path: 'resource' }]
    }
  },
  created: function () {
    document.addEventListener('click', this.hideAsideMenu)
  },
  computed: {
    ...mapState('platform', ['userdata', 'editMode'])
  },
  methods: {
    ...mapMutations('platform', ['showAsideMenu', 'hideAsideMenu', 'editModeToggle']),
    headerbarToggle: function () {
      this.mobileHeaderbarOpen ^= 1
    }
  }
}
</script>

<style scoped>
#headerbar {
  width: var(--fullWidth);
  height: var(--headerbar-height);
  background: var(--headerbar-color);
  color: white;
  position: fixed;
  z-index: 50;
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

.headerbar-mobile {
  float: right;
}

#arrow {
  transition: transform 0.3s ease;
}

.headerbar-mobile-menu {
  margin: 0;
  padding: 0;
  list-style: none;
  flex-direction: column;
  width: var(--fullWidth);
  background: var(--headerbar-color);
}

.headerbar-mobile-menu-item {
  width: 100%;
  height: var(--headerbar-height);
  line-height: var(--headerbar-height);
  text-align: center;
  color: #fff;
  transition: all 0.3s ease;
}

.headerbar-mobile-menu-item:hover {
  background: var(--headerbar-hover-color);
  cursor: pointer;
}

/* header bar RWD */
/* start */
@media screen and (min-width: 1200px) {
  .headerbar-desktop {
    display: flex;
  }
  .headerbar-mobile,
  .headerbar-mobile-menu {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .headerbar-desktop {
    display: none;
  }
  .headerbar-mobile,
  .headerbar-mobile-menu {
    display: flex;
  }
}
/* end */

.logo {
  height: 85%;
}

.menu-icon {
  height: 50%;
}

.link {
  text-decoration: none;
  color: white;
}

</style>
