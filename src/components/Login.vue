<!-- html part -->
<template>
  <div id="login">
    <h1>LifeGamer Platform</h1>
    <div class="loginButton" @click="login">Login</div>
  </div>
</template>


<!-- javascript part -->
<script>
export default {
  name: "Login",
  methods: {
    login: function() {
      window.location.href = "https://hmkrl.com/auth";
    }
  }
};
</script>

<!-- css part -->
<style>
:root {
  --background-url: "";
  --button-color: #333;
  --button-hover-color: #666;
}

#login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loginButton {
  border-radius: 5px;
  background: var(--button-color);
  color: white;
  margin-top: 200px;
  width: 150px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.loginButton:hover {
  background: var(--button-hover-color);
  cursor: pointer;
}
</style>
