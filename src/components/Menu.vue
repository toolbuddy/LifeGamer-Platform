<!-- html part -->
<template>
  <aside id="menu">
      <div class="img-wrapper">
          <div></div>
      </div>
      <div class="option-wrapper">
        <ul class="menu-list-wrapper">
          <li class="menu-list" v-for="item in items" :key="item.id">
            <span class="option-bar"></span>
            <span class="menu-content"> {{ item.value }} </span>
          </li>
        </ul>
      </div>
  </aside>
</template>

<!-- javascript part -->
<script>
const menuItem = [];
export default {
  name: "Menu",
  data: function() {
    return {
      items: menuItem
    };
  }
};
</script>

<!-- css part -->
<style scope>
:root {
  --menu-background-color: #006d70;
  --menu-width: 250px;
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
