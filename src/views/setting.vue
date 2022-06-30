<template>
  <div class="main" id="main">
    <h4>通用设置</h4>
    <div class="item">
      <span>悬浮窗</span>
      <el-switch
        @change="floatingFn"
        v-model="setting.floating"
        class="ml-2"
        style="--el-switch-on-color: #13ce66"
      />
    </div>
    <!-- <div class="item">
      <span>黑夜模式</span>
      <el-switch
        v-model="dark"
        class="ml-2"
        style="--el-switch-on-color: #13ce66"
      />
    </div> -->
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
      setting: {
        floating: true,
      },
    };
  },
  methods: {
    floatingFn(status) {
      console.log("status", status);
    },
  },
  unmounted() {
    console.log("unmounted");
  },
  created() {
    store.dispatch("header/setPageTypeText", "set");
    console.log("store", store);
  },
};
</script>
<style lang="scss" scoped>
.main {
  text-align: left;
  .item {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      margin-right: 10px;
    }
  }

  h4 {
    margin: 0px;
    margin-bottom: 5px;
  }
}
</style>