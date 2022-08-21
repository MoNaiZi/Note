<template>
  <div :class="style['container']">
    <div :id="style['svg-wrapper']" ref="wrapperEle">
      <svg :class="style['svg']" ref="svgEle">
        <g ref="gEle">
          <foreignObject ref="foreignEle" style="display: none">
            <div ref="foreignDivEle" contenteditable></div>
          </foreignObject>
        </g>
      </svg>
    </div>
    <svg ref="asstSvgEle" :class="style['asst-svg']"></svg>
    <div :class="[style['button-list'], style['right-bottom']]">
      <!-- <button @click="centerView()"></button> -->
      <button @click="fitView()">
        <local theme="outline" size="24" fill="#979797" />
      </button>
      <!-- <button v-if="downloadBtn" @click="download()">
        <i :class="style['download']"></i>
      </button> -->
    </div>
    <div v-if="timetravel" :class="[style['button-list'], style['right-top']]">
      <button @click="prev" :class="{ [style['disabled']]: !hasPrev }">
        <back
          :class="[hasPrev ? 'hasPrevAndNextActive' : 'hasPrevAndNextDef']"
          theme="outline"
          size="24"
        />
      </button>
      <button @click="next" :class="{ [style['disabled']]: !hasNext }">
        <next
          :class="[hasNext ? 'hasPrevAndNextActive' : 'hasPrevAndNextDef']"
          theme="outline"
          size="24"
        />
      </button>
    </div>
    <contextmenu
      v-if="ctm"
      :position="contextmenuPos"
      :groups="menu"
      @click-item="onClickMenu"
    ></contextmenu>
  </div>
  s
</template>

<script lang="ts">
import emitter from "@/mitt";
import { defineComponent, onMounted, PropType, watch, watchEffect } from "vue";
import { Data, Locale, TwoNumber } from "./interface";
import style from "./css";
import * as d3 from "./d3";
import { cloneDeep } from "lodash";
import { hasNext, hasPrev } from "./state";
import {
  fitView,
  getSize,
  centerView,
  next,
  prev,
  download,
  bindForeignDiv,
} from "./assistant";
import {
  xGap,
  yGap,
  branch,
  scaleExtent,
  ctm,
  selection,
  changeSharpCorner,
  addNodeBtn,
  mmprops,
} from "./variable";
import {
  wrapperEle,
  svgEle,
  gEle,
  asstSvgEle,
  foreignEle,
  foreignDivEle,
} from "./variable/element";
import { draw } from "./draw";
import {
  switchZoom,
  switchEdit,
  switchSelect,
  switchContextmenu,
  switchDrag,
  onClickMenu,
} from "./listener";
import Contextmenu from "./Contextmenu.vue";
import { afterOperation, mmdata, ImData } from "./data/index";
import { mapState } from "vuex";
import { Local, Back, Next } from "@icon-park/vue-next";
export default defineComponent({
  name: "Mindmap",
  computed: {
    ...mapState("user", {
      dark: (state: any) => state.user.dark,
    }),
  },
  components: {
    Contextmenu,
    Local,
    Back,
    Next,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Array as PropType<Data[]>,
      required: true,
    },
    // 绘制所需的变量
    xGap: { type: Number, default: xGap },
    yGap: { type: Number, default: yGap },
    branch: {
      type: Number,
      default: branch,
      validator: (val: number) => val >= 1 && val <= 6,
    },
    scaleExtent: {
      type: Object as PropType<TwoNumber>,
      default: scaleExtent,
    },
    sharpCorner: Boolean,
    // 操作许可
    centerBtn: Boolean,
    fitBtn: Boolean,
    downloadBtn: Boolean,
    timetravel: Boolean,
    addNodeBtn: Boolean,
    edit: Boolean,
    drag: Boolean,
    keyboard: Boolean,
    ctm: Boolean,
    zoom: Boolean,
    // i18n
    locale: { type: String as PropType<Locale>, default: "zh" },
  },
  setup(props, context) {
    // 立即执行

    // watchEffect(() => i18next.changeLanguage(props.locale));
    watchEffect(() => emitter.emit("scale-extent", props.scaleExtent));
    watchEffect(() => emitter.emit("branch", props.branch));
    watchEffect(() => emitter.emit("sharp-corner", props.sharpCorner));
    watchEffect(() =>
      emitter.emit("gap", { xGap: props.xGap, yGap: props.yGap })
    );
    watchEffect(() => emitter.emit("mindmap-context", context));
    watchEffect(() => (addNodeBtn.value = props.edit && props.addNodeBtn));
    watchEffect(() => (mmprops.value.drag = props.drag));
    watchEffect(() => (mmprops.value.edit = props.edit));
    // onMounted
    onMounted(() => {
      if (
        !svgEle.value ||
        !gEle.value ||
        !asstSvgEle.value ||
        !foreignEle.value ||
        !foreignDivEle.value
      ) {
        return;
      }
      console.log("mounted");
      emitter.emit("selection-svg", d3.select(svgEle.value));
      emitter.emit("selection-g", d3.select(gEle.value));
      emitter.emit("selection-asstSvg", d3.select(asstSvgEle.value));
      emitter.emit("selection-foreign", d3.select(foreignEle.value));

      const data = cloneDeep(props.modelValue[0]);

      const result = new ImData(data, xGap, yGap, getSize);

      emitter.emit("mmdata", result);

      changeSharpCorner.value = false;

      afterOperation();
      const { svg, foreign } = selection;
      foreign?.raise();

      bindForeignDiv();
      fitView();
      window.addEventListener("resize", () => {
        fitView();
      });
      // mousedown与drag/zoom绑定的先后顺序会有影响
      svg?.on("mousedown", () => {
        const oldSele = document.getElementsByClassName(style.selected)[0];
        oldSele?.classList.remove(style.selected);
      });
      switchZoom(props.zoom);
      switchContextmenu(props.ctm);
    });
    // watch
    watch(
      () => [props.branch, addNodeBtn.value, props.sharpCorner],
      () => {
        draw(mmdata);
        changeSharpCorner.value = false;
      }
    );
    watch(
      () => [props.xGap, props.yGap],
      (val) => {
        mmdata.setBoundingBox(val[0], val[1]);
        draw(mmdata);
      }
    );
    watch(
      () => [props.drag, props.edit],
      (val) => {
        switchSelect(val[0] || val[1]);
        switchDrag(val[0]);
        switchEdit(val[1]);
      }
    );
    watch(
      () => props.zoom,
      (val) => switchZoom(val)
    );
    watch(
      () => props.ctm,
      (val) => switchContextmenu(val)
    );

    return {
      wrapperEle,
      svgEle,
      gEle,
      style,
      asstSvgEle,
      foreignEle,
      foreignDivEle,
      centerView,
      fitView,
      download,
      menu: ctm.menu,
      contextmenuPos: ctm.pos,
      onClickMenu,
      next,
      prev,
      hasPrev,
      hasNext,
    };
  },
});
</script>
