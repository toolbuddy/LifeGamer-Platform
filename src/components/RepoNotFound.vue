<template>
  <div class="repo-not-found">
    <div class="img-wrapper">
      <img src="../assets/404.svg"/>
    </div>
    <h4>404 not found</h4>
    <p>Cannot find your repo, please goto gitlab and fork the repo.</p>
  </div>
</template>

<script>
export default {
  name: 'repoNotFound'
}
</script>

<style scoped>
.repo-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img-wrapper {
  width: 60%;
  height: auto;
}

.img-wrapper > img {
  width: 100%;
  height: auto;
}

</style>
