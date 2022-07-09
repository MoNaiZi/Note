<template>
  <div class="drag_main" @mousedown="onMouseDown" @mouseup="end">
    <slot></slot>
  </div>
</template>


<script>
const { ipcRenderer } = require("electron");
import { mapState } from "vuex";
let mouseX, mouseY;
let beforeX, beforeY, afterX, afterY;
export default {
  computed: {
    ...mapState("header", {
      pageTypeText: (state) => state.pageTypeText,
    }),
  },
  props: {},
  watch: {
    pageTypeText: function () {
      this.init();
    },
  },
  data() {
    return {
      isDrag: false,
      width: 350,
      height: 600,
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
    init() {
      const that = this;
      const pageTypeText = this.pageTypeText;
      if (pageTypeText != "menu") {
        window.addEventListener("resize", function (e) {
          if (!that.isDrag) {
            let currentTarget = e.currentTarget;
            that.width = currentTarget.outerWidth;
            that.height = currentTarget.outerHeight;
          }
        });
      }
      switch (pageTypeText) {
        case "edited":
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
    },
    end(e) {
      [afterX, afterY] = [e.offsetX, e.offsetY];
      this.isDrag = false;
      if (beforeX === afterX && beforeY === afterY) {
        this.$emit("click");
      }

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
      const that = this;
      //   console.log(that);
      if (that.isDrag) {
        let config = {
          mouseX,
          mouseY,
        };
        if (that.height) {
          config.height = that.height;
        }
        if (that.width) {
          config.width = that.width;
        }
        // console.log("config", config);
        ipcRenderer.send("windowMoving", config);
      }
    },
  },
};
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
