<template>
  <div class="menu_main" @mousedown="onMouseDown" @mouseup="end">
    <div :class="['main', { open: open }]" @click.stop="openMenu">
      <menuStyle></menuStyle>
    </div>
    <!-- <div :class="['item_main', { item_main_open: open }]">
      <template v-for="(item, index) in 4" :key="index">
        <div class="item" :style="itemStyle(item, index)"></div>
      </template>
    </div> -->
  </div>
</template>
<script>
import { store } from "@/store";
import menuStyle from "@/components/menu_style.vue";
import { getQueryByName } from "@/utils";
const { ipcRenderer } = require("electron");
let mouseX;
let mouseY;
let beforeX, beforeY, afterX, afterY;

export default {
  components: {
    menuStyle,
  },
  data() {
    return {
      tip: "",
      isDrag: false,
      open: false,
      open_item: false,
      winIdList: [],
    };
  },
  created() {
    let winIdList = getQueryByName("winIdList");
    if (winIdList) {
      this.winIdList = JSON.parse(winIdList);
      console.log("winIdList", winIdList);
    }

    store.dispatch("header/setPageTypeText", "menu");
    window.addEventListener("mousemove", this.move);
  },
  methods: {
    itemStyle(item, index) {
      console.log(item, index);
      // const open = this.open;
      let result = {};
      switch (index) {
        case 0:
          result = {
            top: "37px",
            right: "-97px",
          };
          break;
        case 1:
          result = {
            top: "16px",
            right: "-61px",
          };
          break;
        case 2:
          result = {
            top: "14px",
            right: "-36px",
          };
          break;
        case 3:
          result = {
            top: "25px",
            right: "-34px",
          };
          break;
        default:
          break;
      }

      return result;
    },
    debounce(func, wait, immediate) {
      let timeout;
      console.log("1");
      return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
          let callNow = !timeout;
          timeout = setTimeout(function () {
            timeout = null;
          }, wait);
          if (callNow) func.apply(context, args);
        } else {
          timeout = setTimeout(function () {
            func.apply(context, args);
          }, wait);
        }
      };
    },
    openMenu() {
      console.log("openMenu");
      if (beforeX === afterX && beforeY === afterY) {
        this.open = !this.open;
        // ipcRenderer.send("addWH", { w: 50, h: 50 }, this.open);
        const winIdList = this.winIdList;
        for (let id of winIdList) {
          ipcRenderer.send("newWindow", id, 1);
          ipcRenderer.send("closeSuspensionWin", id);
        }

        setTimeout(() => {
          this.open_item = !this.open_item;
        }, 1000);
      }
    },
    end(e) {
      console.log("触摸结束", e.clientX);
      console.log(" mouseX", mouseX);
      [afterX, afterY] = [e.offsetX, e.offsetY];
      this.isDrag = false;
      // this.debounce(this.openMenu, 500, true);
    },

    onMouseDown(e) {
      this.isDrag = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      beforeX = e.offsetX;
      beforeY = e.offsetY;
    },
    move() {
      if (this.isDrag && !this.open) {
        ipcRenderer.send("windowMoving", {
          mouseX,
          mouseY,
          width: 100,
          height: 100,
        });
      }
    },
  },
  mounted() {
    this.wrap = document.querySelector(".wrap");
  },
};
</script>

<style scoped lang="scss">
$bgColor: #fff;
.item_main_open {
  // opacity: 0 !important;
  // transition: 0.1s;
  // transform: scale(0.4);
  // left: -3px;
  // top: -7px;
  transform: scale(1) translateX(-4px) translateY(-4px) !important;
}
.item_main {
  // opacity: 1;
  position: relative;
  display: flex;

  flex-direction: column;
  transition: 0.1s;
  transform: scale(0) translateX(-70px) translateY(-70px);
  .item {
    // transition: 1s;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: $bgColor;
    position: relative;
    box-shadow: 0 0 4px #cbcbcb;
  }
  .item:hover {
    box-shadow: 0 0 13px #cbcbcb;
  }
}

.menu_main {
  background: #fff0;
  position: relative;
  height: 100vh;
}
.open {
  // transform: scale(0.5) !important;
  // transition: 0.2s;
}
.main:hover {
  box-shadow: 0 0 12px #cbcbcb;
  cursor: pointer;
  //   -webkit-app-region: drag;
}
.main {
  z-index: 10;
  transition: 0.2s;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  // background: $bgColor;
  position: absolute;
  bottom: 15px;
  right: 5px;
  box-shadow: 0 0 4px #cbcbcb;
  // transform: translate(-50%, -50%);
}
</style>