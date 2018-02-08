<template>
  <div v-if="loaded">
    <header id="headerbar" :style="headertoggle">
        <ul class="headerbar-menu-wrapper">
                <li id="MenuIcon" class="headerbar-menu menuicon-wrapper" @click="showMenu">
                    <img class="menu-icon" src="../assets/menu.svg" />
                </li>
                <li class="headerbar-menu">
                    <img class="logo" src="../assets/logo.svg" />
                </li>
                <li class="headerbar-menu" v-for="item in headerlist" :key="item.id" >
                {{ item.value }}
                </li>
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
              <span class="option-bar"></span>
              <a class="menu-content gitlablink" :href="userdata.web_url">Gitlab</a>
            </li>
            <li class="menu-list">
                <span class="option-bar"></span>
                <span class="menu-content">Grade</span>
            </li>
            <li class="menu-list">
                <span class="option-bar"></span>
                <span class="menu-content" @click="cleanCookie">Logout</span>
            </li>
            </ul>
        </div>
    </aside>
  </div>
</template>

<script>
const headerlist = [
  { value: "Announce" },
  { value: "Demo Time" },
  { value: "Battle Field" },
  { value: "Resources" }
];

export default {
  name: "Frame",
  data: function() {
    return {
      loaded: false,
      headertop: 0,
      menuleft: "-250px",
      _scrollY: 0,
      token: null,
      userdata: null,
      headerlist: headerlist
    };
  },
  computed: {
    menutoggle: function() {
      return {
        left: this.menuleft
      };
    },
    headertoggle: function() {
      return {
        top: this.headertop
      };
    },
    useravatar_bgurl: function() {
      return {
        "background-image": `url( ${this.userdata.avatar_url} )`
      };
    }
  },
  created: function() {
    this.getCookie();
    this.getuserdata();
    document.addEventListener("scroll", this.toggleHeaderBar);
  },
  methods: {
    showMenu: function() {
      this.menuleft = "0px";
      document.addEventListener("click", this.hideMenu);
    },
    hideMenu: function(event) {
      let x = event.clientX;
      if (this.menuleft === "0px" && x > 250) {
        this.menuleft = "-250px";
        window.removeEventListener("click", this.hideMenu);
      }
    },
    toggleHeaderBar: function() {
      let scrollY = window.scrollY;
      if (this._scrollY < scrollY) {
        /* scroll down */
        this.headertop = "0px";
      } else if (scrollY == 0) {
        /* scroll to the top */
        this.headertop = "0px";
      } else {
        /* scroll up */
        this.headertop = "-10%";
      }
      this._scrollY = scrollY;
    },
    getCookie: function() {
      this.token = this.$cookies.get("token");
    },
    getuserdata: function() {
      /* get user data via vue-resource */
      this.$http
        .get(`https://hmkrl.com/gitlab/api/v4/user?access_token=${this.token}`)
        .then(
          response => {
            // set data
            this.userdata = response.body;
            this.loaded = true;
          },
          response => {
            // error callback
            console.error(response);
            /* cannot get response, redirect to /auth */
            window.location.href = "https://hmkrl.com/auth";
          }
        );
    },
    cleanCookie: function() {
      this.$http.get("https://hmkrl.com/gitlab/users/sign_out");
      this.$cookies.remove("token");
      window.location.reload();
    }
  }
};
</script>

<style scope>
:root {
  --fullWidth: 100%;
  --headerbar-height: 9%;
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
  margin-bottom: 40px;
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
  padding-left: 30px;
}

.menu-list-wrapper {
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-list {
  padding: 8px 0;
  margin: 10px 5px;
}

.option-bar {
  margin-right: 30px;
  border-left: 5px solid #fff;
}

.menu-content {
  opacity: 0.5;
}

.menu-content:hover {
  opacity: 1;
  cursor: pointer;
}

.gitlablink {
  text-decoration: none;
  color: white;
}
</style>
