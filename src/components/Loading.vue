<template>
  <div class="waiting-page">
    <div class="waiting-box"></div>
    <div>please wait...</div>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped>
.waiting-page {
  display: flex;
  width: 100%;
  height: 450px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.waiting-page > div { margin: 15px; }

.waiting-box {
  width: 80px;
  height: 80px;
  background-color: red;
  animation: 1s animate-inifite infinite;
}

@keyframes animate-inifite {
  0% {
    border-radius: 0;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 50%;
    transform: rotate(360deg);
  }
  100% {
    border-radius: 0;
    transform: rotate(720deg);
  }
}
</style>
