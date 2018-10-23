<!-- html part -->
<template>
  <div id='loginpage'>
    <div class="title">
      <h1>LifeGamer Platform</h1>
      <h3>An Intergrated Game Project Platform</h3>
      <div class='loginButton' @click='login'><strong>Login</strong></div>
    </div>
  </div>
</template>

<!-- javascript part -->
<script>
const config = require('../../config/config')[process.env.NODE_ENV]

export default {
  name: 'Login',
  methods: {
    login: () => { window.location.href = `${config.hostname}/auth` }
  }
}
</script>

<!-- css part -->
<style scoped>
#loginpage {
  width: 100%;
  height: 100%;
  padding: 8%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
}

.title {
  background: #333;
  color: white;
  opacity: 0.75;
  padding: 15px;
  text-align: center;
  border: 10px solid aliceblue;
}

.loginButton {
  background: var(--login-button-color);
  height: 50px;
  margin-top: 30px;
  line-height: 50px;
  color: #fff;
  border-radius: 8px;
}

.loginButton:hover {
  cursor: pointer;
  background: var(--login-button-hover-color);
}

@media screen and (min-width: 1200px) {
  #loginpage {
    background-image: url("../assets/background.png");
  }
}
@media screen and (min-width: 600px) and (max-width: 1200px) {
  #loginpage {
    background-image: url("../assets/background_landscape.png");
  }
}
@media screen and (max-width: 599px) {
  #loginpage {
    background-image: url("../assets/background_portrait.png");
  }
}
</style>
