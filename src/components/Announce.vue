<!-- HTML part -->
<template>
    <div id="markdown-body">
        <section v-html="markdownString"></section>
    </div>
</template>

<!-- js part -->
<script>
import Vue from "vue";

export default {
  name: "Announce",
  data: function() {
    return {
      markdownString:
        '```cpp\n #include <iostream> \n\n using namespace std;\n\n int main() {\n cout << "hello world" << endl;\n return 0;\n}```'
    };
  },
  created: function() {
    var marked = require("marked");
    var hljs = require("highlight.js");
    marked.setOptions({
      highlight: function(code) {
        return hljs.highlightAuto(code).value;
      }
    });
    this.markdownString = marked(this.markdownString);
  },
  mounted: function() {
    /* add class hljs for code section */
    let codeSection = Array.from(document.querySelectorAll("code"));
    codeSection.forEach(item => {
      item.classList.add("hljs");
    });
  }
};
</script>

<!-- css part -->
<style scope>
#markdown-body {
  margin-top: 25px;
  padding: 1.5rem;
}
</style>

<style scope src="./style/monokai-sublime.css"></style>
