<template>
  <div class="main" @mousedown="onMouseDown" @mouseup="end">
    <div>
      {{ tip }}
    </div>
  </div>
</template>
<script>
import { store } from "@/store";
const { ipcRenderer } = require("electron");
let mouseX;
let mouseY;
export default {
  data() {
    return {
      tip: "",
      isDrag: false,
    };
  },
  created() {
    store.dispatch("header/setPageTypeText", "menu");
    window.addEventListener("mousemove", this.move);
  },
  methods: {
    end() {
      this.isDrag = false;
    },
    onMouseDown(e) {
      this.isDrag = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    move() {
      if (this.isDrag) {
        ipcRenderer.send("windowMoving", { mouseX, mouseY });
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.drag_main {
  -webkit-app-region: drag;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
}
.drag {
}
.content {
  width: 100%;
  height: 100%;
}
.main:hover {
  box-shadow: 0 0 4px #cbcbcb;
  //   -webkit-app-region: drag;
}
.main {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f2f2f2;
}
</style>