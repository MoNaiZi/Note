<template>
  <div class="set_main" id="set_main">
    <h4>通用设置</h4>
    <div class="item">
      <span>黑夜模式</span>
      <el-switch
        v-model="setting.dark"
        class="ml-2"
        style="--el-switch-on-color: #13ce66"
      />
    </div>
  </div>
</template>
<script>
// import { mapState } from "vuex";/
const { ipcRenderer } = require("electron");
import { store } from "@/store";
export default {
  computed: {
    // ...mapState({
    //   pageTypeText: (state) => console.log("state", state),
    // }),
  },
  watch: {
    setting: {
      deep: true,
      handler(val) {
        console.log("val", val);
        if (val && JSON.stringify(val) != "{}") {
          ipcRenderer.send("setUser", JSON.parse(JSON.stringify(val)));
        }
      },
    },
  },
  data() {
    return {
      setting: {
        dark: false,
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
    ipcRenderer.invoke("getUser").then((config) => {
      if (config) {
        this.setting = config;
        store.dispatch("user/setUser", config);
      }
    });
    console.log("store", store);
  },
};
</script>
<style lang="scss" scoped>
.set_main {
  text-align: left;
  padding: 10px;
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