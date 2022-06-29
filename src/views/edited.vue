<template>
  <div class="edited_main">edited</div>
</template>
<script>
import { store } from "@/store";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
const getQueryByName = (name) => {
  const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`);
  const queryNameMatch = window.location.hash.match(queryNameRegex);
  return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : "";
};
export default {
  computed: {
    ...mapState("header", {
      header: (state) => state.note,
    }),
  },
  data() {
    return {
      note: {},
    };
  },
  mounted() {
    let edited_main = document.querySelector(".edited_main");
    edited_main.addEventListener("click", () => {
      store.dispatch("header/setIsEditedTitle", false);
    });
  },
  async created() {
    let winId = getQueryByName("winId");
    let note = {};
    if (winId === "undefined") {
      note._id = this.$createdId();
    } else {
      note = await ipcRenderer.invoke("getNote", winId);
    }
    this.note = note;
    console.log("note", note);
    store.dispatch("header/setNote", note);
    store.dispatch("header/setPageTypeText", "edited");

    addEventListener("unload", () => {
      let { note } = this;
      let { title } = this.header;
      let tempOjb = {};
      if (title) {
        tempOjb.title = title;
      }
      ipcRenderer.send("closeEdited", note._id, tempOjb);
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
  },
  beforeUnmount() {},
};
</script>
<style lang="scss" scoped>
</style>