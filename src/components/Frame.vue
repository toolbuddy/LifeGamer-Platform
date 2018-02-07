<template>
  <div>
    <header id="headerbar" :style="HeaderStyle">
        <ul class="headerbar-menu-wrapper">
                <li id="MenuIcon" class="headerbar-menu menuicon-wrapper" @click="showMenu">
                    <img class="menu-icon" src="../assets/menu.svg" />
                </li>
                <li class="headerbar-menu">
                    <img class="logo" src="../assets/logo.svg" />
                </li>
                <li class="headerbar-menu" v-for="item in headerlist" :key="item.id">
                {{ item.value }}
                </li>
            </ul>
    </header>
    <aside id="menu" :style="MenuStyle">
        <div class="img-wrapper">
            <div></div>
        </div>
        <div class="option-wrapper">
            <ul class="menu-list-wrapper">
            <div class="username_wrapper">
                <div class="username">Username</div>
                <div class="studentID">Student ID</div>
            </div>
            <li class="menu-list" v-for="item in menulist" :key="item.id">
                <span class="option-bar"></span>
                <span class="menu-content"> {{ item.value }} </span>
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

const menulist = [{ value: "Gitlab" }, { value: "Grade" }, { value: "Logout" }];

export default {
  name: "Frame",
  data: function() {
    return {
      MenuStyle: {
        left: "-250px"
      },
      HeaderStyle: {
        top: "0px"
      },
      _scrollY: 0,
      token: "",
      headerlist: headerlist,
      menulist: menulist
    };
  },
  created: function() {
    this.getCookie();
    document.addEventListener("scroll", this.toggleHeaderBar);
  },
  methods: {
    showMenu: function() {
      this.MenuStyle.left = "0px";
      document.addEventListener("click", this.hideMenu);
    },
    hideMenu: function(event) {
      let x = event.clientX;
      if (this.MenuStyle.left === "0px" && x > 250) {
        this.MenuStyle.left = "-250px";
        window.removeEventListener("click", this.hideMenu);
      }
    },
    toggleHeaderBar: function() {
      let scrollY = window.scrollY;
      if (this._scrollY < scrollY) {
        /* scroll down */
        this.HeaderStyle.top = "0px";
      } else if (scrollY == 0) {
        /* scroll to the top */
        this.HeaderStyle.top = "0px";
      } else {
        /* scroll up */
        this.HeaderStyle.top = "-10%";
      }
      this._scrollY = scrollY;
    },
    getCookie: function() {
      this.token = this.$cookies.get("token");
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

.img-wrapper > div {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 50%;
}

.username_wrapper {
  margin-bottom: 25px;
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
</style>
