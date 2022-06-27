<template>
  <div>edited</div>
</template>
<script>
import { store } from "@/store";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
export default {
  computed: {
    ...mapState("header", {
      title: (state) => state.title,
    }),
  },
  data() {
    return {
      winId: this.$createdId(),
    };
  },
  created() {
    // window.addEventListener("DOMContentLoaded", () => {
    //   ipcRenderer.on("abcd", (_event, value) => {
    //     console.log("value", value);
    //     ipcRenderer.send("getList2");
    //   });
    // });
    ipcRenderer.on("closeEdited", () => {
      let { title, winId } = this;
      let tempOjb = { title, winId };
      ipcRenderer.send("getEdited", tempOjb);
    });
    ipcRenderer.once("provide-worker-channel", (event) => {
      console.log("收到回复");
      // 一旦收到回复, 我们可以这样做...
      const [port] = event.ports;
      // ... 注册一个接收结果处理器 ...
      port.onmessage = (event) => {
        console.log("received result:", event.data);
      };
      // ... 并开始发送消息给 work!
      port.postMessage(21);
    });
    store.dispatch("header/setPageTypeText", "edited");
    console.log("this.winId", this.winId);
    store.dispatch("header/setWinId", this.winId);
  },
  unmounted() {
    ipcRenderer.send("getList2");
  },
};
</script>
<style lang="scss" scoped>
</style>