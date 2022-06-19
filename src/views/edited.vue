<template>
  <div>edited</div>
</template>
<script>
import { store } from "@/store";
export default {
  data() {
    return {
      winId: this.$createdId(),
    };
  },
  created() {
    store.dispatch("header/setPageTypeText", "edited");
    console.log("this.winId", this.winId);
    store.dispatch("header/setWinId", this.winId);
  },
};
</script>
<style lang="scss" scoped>
</style>