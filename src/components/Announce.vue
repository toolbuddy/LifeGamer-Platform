<!-- HTML part -->
<template>
    <div id="markdown-body">
        <markdown></markdown>
    </div>
</template>

<!-- js part -->
<script>
import Vue from "vue";
import markdown from "./markdown/Announce.md";

export default {
  name: "Announce",
  components: { markdown }
};
</script>

<!-- css part -->
<style scope>
#markdown-body {
  margin-top: 25px;
  padding: 1.5rem;
}
</style>
