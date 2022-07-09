<template>
  <div class="menu_main">
    <drag>
      <div :class="['main', { open: open }]" @click.stop="openMenu">
        <menuStyle></menuStyle>
      </div>
      <!-- <div :class="['item_main', { item_main_open: open }]">
      <template v-for="(item, index) in 4" :key="index">
        <div class="item" :style="itemStyle(item, index)"></div>
      </template>
    </div> -->
    </drag>
  </div>
</template>
<script>
import { store } from "@/store";
import menuStyle from "@/components/menu_style.vue";
import { getQueryByName } from "@/utils";
import drag from "@/components/drag";
const { ipcRenderer } = require("electron");
let timeout;
export default {
  components: {
    menuStyle,
    drag,
  },
  data() {
    return {
      tip: "",
      open: false,
      open_item: false,
      winIdList: [],
    };
  },
  created() {
    store.dispatch("header/setPageTypeText", "menu");
    let winIdList = getQueryByName("winIdList");
    console.log("winIdList", winIdList);
    if (winIdList && winIdList != "undefined") {
      this.winIdList = JSON.parse(winIdList);
    }
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
      console.log("1");
      return function () {
        console.log("2");
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
      const that = this;
      let fn = function () {
        console.log("openMenu");
        that.open = !that.open;

        const winIdList = that.winIdList;
        for (let id of winIdList) {
          ipcRenderer.send("newWindow", id, 1);
          ipcRenderer.send("closeSuspensionWin", id);
        }

        setTimeout(() => {
          that.open_item = !that.open_item;
        }, 1000);
      };

      this.debounce(fn, 1000, true)();
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