<template>
  <div>
    open
    <el-switch
      v-model="value2"
      class="ml-2"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>
<script>
// import { mapState } from "vuex";/
import { store } from "@/store";
export default {
  computed: {
    // ...mapState({
    //   pageTypeText: (state) => console.log("state", state),
    // }),
  },
  data() {
    return {
      value2: false,
    };
  },
  created() {
    store.dispatch("header/setPageTypeText", "set");
    console.log("store", store);
  },
};
</script>
<style lang="scss" scoped>
</style>