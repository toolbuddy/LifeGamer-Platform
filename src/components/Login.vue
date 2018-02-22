<!-- html part -->
<template>
  <div id='loginpage'>
    <h1 class='title'>LifeGamer Platform</h1>
    <h3 class='subtitle'>An Intergrated Game Project Platform</h3>
    <div class='loginButton' @click='login'><strong>Login</strong></div>
  </div>
</template>

<!-- javascript part -->
<script>
export default {
  name: 'Login',
  methods: {
    login: function () {
      window.location.href = 'https://hmkrl.com/auth'
    }
  }
}
</script>

<!-- css part -->
<style>
:root {
  --background-url: '';
  --button-color: #333;
  --button-hover-color: #666;
}

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

.subtitle {
  background: #333;
  color: white;
  opacity: 0.75;
  padding: 15px;
}

.loginButton {
  background: var(--button-color);
  width: 150px;
  height: 50px;
  margin-top: 30px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  border-radius: 8px;
}

.loginButton:hover {
  background: var(--button-hover-color);
  cursor: pointer;
}

@media screen and (min-width: 1200px) {
  .title {
    font-size: 55px;
  }
  #loginpage {
    background-image: url('../assets/background.png');
  }
}
@media screen and (min-width: 600px) and (max-width: 1200px) {
  .title {
    font-size: 28px;
  }
  #loginpage {
    background-image: url('../assets/background_landscape.png');
  }
}
@media screen and (max-width: 599px) {
  .title {
    font-size: 22px;
  }
  #loginpage {
    background-image: url('../assets/background_portrait.png');
  }
}
</style>
