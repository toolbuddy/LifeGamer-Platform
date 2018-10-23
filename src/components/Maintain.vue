<template>
  <div class="maintain">
    <div class="message">
      <p>伺服器維護中</p>
      <p>Server under maintenance</p>
      <div class="logoutButton" @click="logout">Logout</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Maintain',
  methods: {
    ...mapActions('platform', ['logout'])
  }
}

</script>

<style scoped>
.maintain {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #666;
}

.message {
  font-weight: bold;
  font-size: 35px;
  width: 70vw;
  border: 5px solid #fff;
  text-align: center;
  color: #fff;
}

.logoutButton {
  margin: 15px;
  line-height: 2em;
}

.logoutButton:hover {
  cursor: pointer;
  background: #aaa;
}
</style>
