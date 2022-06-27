<template>
  <el-input
    v-model="input3"
    class="w-50 m-2"
    placeholder="请输入标题"
    :suffix-icon="'Search'"
  />
  <div class="list">
    <div v-for="item in list" :key="item" class="item" @click="onmessage">
      <h3>{{ item.title }}</h3>
      <div class="content"></div>
    </div>
  </div>
</template>

<script>
import { store } from "@/store";
import { mapGetters } from "vuex";
const { ipcRenderer } = require("electron");
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("note", {
      list: "getNoteList",
    }),
  },
  created() {
    // const that = this;
    // const channel = new MessageChannel();
    // console.log("ipcRenderer", ipcRenderer);
    store.dispatch("header/setPageTypeText", "home");
    console.log("ipcRenderer", ipcRenderer);
    console.log("window", window);

    window.onmessage = (event) => {
      // event.source === window 表示消息来自预加载脚本
      // 而不是来自 <iframe> 或其他来源
      this.event = event;
      if (event.source === window && event.data === "main-world-port") {
        console.log("event", event);
        const [port] = event.ports;
        // 一旦我们有了这个端口，我们就可以直接与主进程通信
        port.onmessage = (event) => {
          console.log("from main process:", event.data);
          let test = event.data.test;
          port.postMessage(test * 2);
        };
      }
    };

    ipcRenderer.invoke("getList").then((list) => {
      store.dispatch("note/setNoteList", list);
    });
    ipcRenderer.on("getEdited", (_event, list) => {
      console.log("关闭触发的事件", list);
      store.dispatch("note/setNoteList", list);
    });
    // window.electronAPI.getList().then((list) => {
    //   that.list = list;
    // });
  },
  methods: {
    onmessage() {
      const { port1 } = new MessageChannel();
      ipcRenderer.postMessage("port", { message: "hello" }, [port1]);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0px;
  padding: 0px;
}
.list {
  height: 83vh;
  overflow: auto;

  .item {
    width: 93%;
    height: 67px;
    padding: -4px;
    box-shadow: 0 0 4px #cbcbcb;
    cursor: pointer;
    margin: 10px auto;
    border-radius: 5px;
    text-align: left;
    padding: 6px;
    .content {
    }
  }
  .item:hover {
    box-shadow: 0 0 4px #9c9c9c;
  }
}
.w-50 {
  width: 91%;
  margin-left: -12px;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  /**/
}
.father::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #333;
}
::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
