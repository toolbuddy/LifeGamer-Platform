<template>
  <div v-if="loaded">
    <header id="headerbar">
        <ul class="headerbar-menu-wrapper">
          <li id="MenuIcon" class="headerbar-menu menuicon-wrapper" @click="showMenu">
            <img class="menu-icon" src="../assets/menu.svg" />
          </li>
          <router-link class="headerbar-menu link" :to="{ name: 'announce' , query: {edit: editMode}}">
            <img class="logo" src="../assets/logo.svg" />
          </router-link>
          <router-link class="headerbar-menu link headerbar-desktop" :to="{ name: item.path, query: {edit: editMode}}" v-for="item in headerlist" :key="item.id" >
            {{ item.value }}
          </router-link>
          <li class="headerbar-menu headerbar-derktop" v-if="userdata.is_admin" @click="editModeToggle" :style="editIcon">
            <img class="menu-icon" :style="editToggle" src="../assets/cog.svg" />
          </li>
          <li class="headerbar-menu headerbar-mobile" @click="headerbarToggle">
            <img id="arrow" class="menu-icon" src="../assets/arrow_down.svg" />
          </li>
        </ul>
        <!-- The components here only show in mobile service -->
        <ul class="headerbar-mobile-menu" :style="headertoggle">
          <router-link class="link headerbar-mobile-menu-item" :to="{ name: item.path , query: {edit: editMode}}" v-for="item in headerlist" :key="item.id">
            {{ item.value }}
          </router-link>
        </ul>
    </header>
    <aside id="menu" :style="menutoggle">
        <div class="img-wrapper">
            <div class="user_avatar" :style="useravatar_bgurl"></div>
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
                <router-link class="menu-content link" :to="{ name: 'grade' , query: {edit: editMode}}">
                  <img class="icon" src="../assets/flag-checkered.svg" />
                  <span>Grade</span>
                </router-link>
            </li>
            <li class="menu-list">
                <span class="menu-content" @click="cleanCookie">
                  <img class="icon" src="../assets/sign-out-alt.svg" />
                  <span>Logout</span>
                </span>
            </li>
            </ul>
        </div>
    </aside>
  </div>
</template>

<script>
const headerlist = [
  { value: 'Demo Time', path: 'demotime' },
  { value: 'Battle Field', path: 'battle' },
  { value: 'Resources', path: 'resource' }
]

const config = require('../../config/config')

export default {
  name: 'Frame',
  data: function () {
    return {
      loaded: false,
      mobileHeaderbarOpen: false,
      menuleft: '-250px',
      token: null,
      userdata: null,
      headerlist: headerlist,
      editMode: false
    }
  },
  computed: {
    menutoggle: function () {
      return {
        left: this.menuleft
      }
    },
    headertoggle: function () {
      return {
        display: this.mobileHeaderbarOpen ? 'flex' : 'none'
      }
    },
    useravatar_bgurl: function () {
      return {
        'background-image': `url( ${this.userdata.avatar_url} )`
      }
    },
    editToggle: function () {
      return {
        transform: `rotate(${this.editMode * -30}deg )`
      }
    },
    editIcon: function () {
      return {
        'background-color': this.editMode ? '#006d70' : '#009688'
      }
    }
  },
  created: function () {
    this.getCookie()
    this.getuserdata()
  },
  destroyed: function () {},
  methods: {
    showMenu: function () {
      this.menuleft = '0px'
      document.addEventListener('click', this.hideMenu)
    },
    hideMenu: function (event) {
      let x = event.clientX
      if (this.menuleft === '0px' && x > 250) {
        this.menuleft = '-250px'
        window.removeEventListener('click', this.hideMenu)
      }
    },
    headerbarToggle: function () {
      this.mobileHeaderbarOpen ^= 1
      document.querySelector(
        'img[id="arrow"]'
      ).style.transform = `rotate( ${this.mobileHeaderbarOpen * 180}deg)`
    },
    getCookie: function () {
      this.token = this.$cookies.get('token')
    },
    getuserdata: function () {
      /* get user data via vue-resource */
      this.$http
        .get(`${config.hostname}/gitlab/api/v4/user?access_token=${this.token}`)
        .then(
          response => {
            // set data
            this.userdata = response.body
            this.loaded = true
          },
          response => {
            // error callback
            console.error(response)
            /* cannot get response, redirect to /auth */
            window.location.href = `${config.hostname}/auth`
          }
        )
    },
    cleanCookie: function () {
      this.$http.get(`${config.hostname}/gitlab/users/sign_out`)
      this.$cookies.remove('token')
      window.location.reload()
    },
    editModeToggle: function () {
      this.editMode ^= 1
      /* same as history.replace() function */
      this.$router.replace({ query: { edit: this.editMode } })
    }
  }
}
</script>

<style scope>
:root {
  --fullWidth: 100%;
  --headerbar-height: 48px;
  --headerbar-color: #009688;
  --headerbar-hover-color: #006d70;
  --menu-background-color: #006d70;
  --menu-width: 250px;
}
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
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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

#menu {
  font-size: 24px;
  position: fixed;
  background: var(--menu-background-color);
  z-index: 99;
  color: white;
  width: var(--menu-width);
  height: 100%;
  overflow: auto;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
