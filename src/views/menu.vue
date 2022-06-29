<template>
  <div class="main">11111</div>
</template>
<script>
import { store } from "@/store";
export default {
  created() {
    store.dispatch("header/setPageTypeText", "menu");
  },
  mounted() {
    let main = document.querySelector(".main");
    main.style.borderRadius = "50%";
  },
};
</script>

<style scoped lang="scss">
.main {
  -webkit-app-region: drag;
  //   width: 90vw;
  //   height: 90vh;
  width: 60px;
  height: 60px;
  background: #ababab;
}
</style>