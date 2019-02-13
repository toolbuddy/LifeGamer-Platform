<template>
  <aside id="menu" :style="{ left: asideMenuCollapse ? '0px' : '-250px' }">
    <div class="img-wrapper">
      <div class="user_avatar" :style="{ 'background-image': `url( ${userdata.avatar_url} )` }"></div>
    </div>
    <div class="option-wrapper">
      <ul class="menu-list-wrapper">
        <div class="username_wrapper">
          <div class="username"> {{ userdata.name }} </div>
          <div class="studentID"> {{ userdata.username }} </div>
        </div>
        <li class="menu-list">
          <a class="menu-content link" :href="userdata.web_url">
            <img class="icon" src="../assets/gitlab.svg" />
            <span>Gitlab</span>
          </a>
        </li>
        <li class="menu-list">
          <router-link class="menu-content link" :to="{ name: 'judge' }">
          <img class="icon" src="../assets/Git-icon-white.svg" />
            <span>Judge</span>
          </router-link>
        </li>
        <li class="menu-list">
          <router-link class="menu-content link" :to="{ name: 'grade' }">
            <img class="icon" src="../assets/flag-checkered.svg" />
            <span>Grade</span>
          </router-link>
        </li>
        <li class="menu-list">
          <span class="menu-content" @click="logout">
            <img class="icon" src="../assets/sign-out-alt.svg" />
            <span>Logout</span>
          </span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AsideMenu',
  computed: {
    ...mapState('platform', ['userdata', 'asideMenuCollapse'])
  },
  methods: {
    ...mapActions('platform', ['logout'])
  }
}
</script>

<style scoped>
#menu {
  font-size: 24px;
  position: fixed;
  background: var(--menu-background-color);
  z-index: 99;
  color: white;
  width: var(--menu-width);
  height: 100%;
  overflow: auto;
  /* set position */
  top: 0;
  left: calc(var(--menu-width) * (-1));
  transition: all 0.5s ease;
}

.img-wrapper {
  display: flex;
  height: 35%;
  min-height: 170px;
  justify-content: center;
  align-items: center;
}

.user_avatar {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 50%;
  background-size: 150px 150px;
  border: 2px solid white;
}

.username_wrapper {
  margin-bottom: 60px;
  padding-right: 25px;
}

.username {
  padding: 5px;
  border-bottom: 3px solid #fff;
}

.studentID {
  float: right;
  font-size: 18px;
  padding: 5px;
}

.option-wrapper {
  height: 65%;
  min-height: 250px;
  padding-left: 30px;
}

.menu-list-wrapper {
  margin: 0;
  padding: 10px 0 0 0;
  list-style: none;
}

.menu-list {
  margin: 13px 5px;
  height: 36px;
}

.menu-content {
  opacity: 1;
  height: 100%;
  float: left;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.menu-content:hover {
  opacity: 0.5;
  cursor: pointer;
}

.link {
  text-decoration: none;
  color: white;
}

.icon {
  height: 100%;
  margin-right: 18px;
}
</style>
