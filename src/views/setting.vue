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
    <div class="item">
      <span>开机自启</span>
      <el-switch
        v-model="setting.startUp"
        class="ml-2"
        style="--el-switch-on-color: #13ce66"
      />
    </div>
    <div class="item">
      <span>显示条数</span>
      <el-input-number v-model="setting.pageSize" :min="1" :max="100" />
    </div>
  </div>
</template>
<script lang="ts">
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
import { store } from "@/store";
import { defineComponent } from "vue";
export default defineComponent({
  computed: {
    ...mapState("user", {
      setting: (state: any) => state.user,
    }),
  },
  watch: {
    setting: {
      deep: true,
      handler(val) {
        console.log("val", val);
        this.count = this.count === 0 ? -1 : 0;
        if (val && JSON.stringify(val) != "{}" && this.count === 0) {
          ipcRenderer.send("setUser", JSON.parse(JSON.stringify(val)));
        }
      },
    },
  },
  data() {
    return {
      count: -1,
    };
  },
  methods: {
    // floatingFn(status) {
    //   console.log("status", status);
    // },
  },
  mounted() {
    // this.count = 0;
  },
  unmounted() {
    console.log("unmounted");
    // ipcRenderer.send("setUser", JSON.parse(JSON.stringify(this.setting)));
  },
  created() {
    store.dispatch("header/setPageTypeText", "set");
    // ipcRenderer.invoke("getUser").then((config) => {
    //   if (config) {
    //     this.setting = config;
    //     store.dispatch("user/setUser", config);
    //   }
    // });
  },
});
</script>
<style lang="scss" scoped>
.set_main {
  text-align: left;
  padding: 10px;
  width: 100vw;
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