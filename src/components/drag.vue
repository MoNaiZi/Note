<template>
  <div
    class="drag_main"
    @dblclick="handWinSize"
    @mousedown="onMouseDown"
    @mouseup="end"
  >
    <slot></slot>
  </div>
</template>


<script lang="ts">
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
import { defineComponent } from "vue";
let mouseX: number, mouseY: number;

export default defineComponent({
  computed: {
    ...mapState("header", {
      pageTypeText: (state: any) => state.pageTypeText,
    }),
  },
  // props: {},
  watch: {
    pageTypeText: function () {
      this.init();
    },
  },
  data() {
    return {
      isDrag: false,
      width: 100,
      height: 600,
      downScreenX: 0,
      downScreenY: 0,
    };
  },
  created() {
    const that = this;
    that.init();
    window.addEventListener("mousemove", that.move);
    window.addEventListener("dblclick", that.end);
    window.addEventListener("mouseup", that.end);
  },
  methods: {
    handWinSize() {
      // ipcRenderer.send("zoomInAndOut");
      this.$emit("zoomInAndOut");
    },
    handleResize(e: any) {
      if (!this.isDrag) {
        let currentTarget: any = e.currentTarget;
        this.width = currentTarget.outerWidth;
        this.height = currentTarget.outerHeight;
      }
    },
    init() {
      // const that = this;
      const pageTypeText = this.pageTypeText;
      if (pageTypeText != "menu") {
        window.addEventListener("resize", this.handleResize);
      }
      if (this.width === 100) {
        switch (pageTypeText) {
          case "edited":
          case "outline":
            {
              this.width = 700;
              this.height = 500;
            }
            break;
          case "menu":
            {
              this.width = 100;
              this.height = 100;
            }
            break;
          default:
            this.width = 350;
            this.height = 600;
            break;
        }
      }
    },
    end(e: any) {
      // console.log("结束", e);
      const [x, y] = [e.screenX, e.screenY];
      const { downScreenX, downScreenY } = this;
      this.isDrag = false;
      if (downScreenX === x && downScreenY === y) {
        this.$emit("dragClick");
      }
    },
    onMouseDown(e: any) {
      // console.log("按下", e);
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.downScreenX = e.screenX;
      this.downScreenY = e.screenY;
      this.isDrag = true;
    },
    move() {
      const that = this;

      type Config = {
        mouseX: number;
        mouseY: number;
        height: number | undefined;
        width: number | undefined;
      };
      if (that.isDrag) {
        let config = {
          mouseX,
          mouseY,
        } as Config;
        if (that.height) {
          config.height = that.height;
        }
        if (that.width) {
          config.width = that.width;
        }

        ipcRenderer.send("windowMoving", config);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.drag_main {
  position: relative;
  cursor: auto;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
