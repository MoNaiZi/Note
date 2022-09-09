<template>
  <div class="menu_main">
    <drag @dragClick="openMenu">
      <div :class="['main', { open: open }]">
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
<script lang="ts">
import { store } from "@/store";
import menuStyle from "@/components/menu_style.vue";
import { getQueryByName, debounce } from "@/utils";
import drag from "@/components/drag.vue";
const { ipcRenderer } = require("electron");
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    menuStyle,
    drag,
  },
  data() {
    return {
      tip: "",
      open: false,
      open_item: false,
      itemList: [],
    };
  },
  created() {
    store.dispatch("header/setPageTypeText", "menu");
    let itemList = getQueryByName("itemList");
    console.log("itemList", itemList);
    if (itemList && itemList != "undefined") {
      this.itemList = JSON.parse(itemList);
    }
  },
  methods: {
    itemStyle(item: any, index: number) {
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

    openMenu: debounce(function () {
      const that: any = this;
      that.open = !that.open;
      const itemList: any = that.itemList;
      for (const item of itemList) {
        ipcRenderer.invoke("newWindow", {
          _id: item._id,
          pageType: 1,
          modeType: item.modeType,
        });
        ipcRenderer.send("closeSuspensionWin", item._id);
      }
      setTimeout(() => {
        that.open_item = !that.open_item;
      }, 1000);
    }),
  },
  mounted() {
    // this.wrap = document.querySelector(".wrap");
  },
});
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