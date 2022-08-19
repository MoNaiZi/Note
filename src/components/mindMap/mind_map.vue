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
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.85786 32.7574C6.23858 33.8432 4 35.3432 4 37C4 40.3137 12.9543 43 24 43C35.0457 43 44 40.3137 44 37C44 35.3432 41.7614 33.8432 38.1421 32.7574"
            stroke="#979797"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24 35C24 35 37 26.504 37 16.6818C37 9.67784 31.1797 4 24 4C16.8203 4 11 9.67784 11 16.6818C11 26.504 24 35 24 35Z"
            fill="none"
            stroke="#979797"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M24 22C26.7614 22 29 19.7614 29 17C29 14.2386 26.7614 12 24 12C21.2386 12 19 14.2386 19 17C19 19.7614 21.2386 22 24 22Z"
            fill="none"
            stroke="#979797"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <!-- <button v-if="downloadBtn" @click="download()">
        <i :class="style['download']"></i>
      </button> -->
    </div>
    <div v-if="timetravel" :class="[style['button-list'], style['right-top']]">
      <button @click="prev" :class="{ [style['disabled']]: !hasPrev }">
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M44 40.8361C39.1069 34.8632 34.7617 31.4739 30.9644 30.6682C27.1671 29.8625 23.5517 29.7408 20.1182 30.303V41L4 23.5453L20.1182 7V17.167C26.4667 17.2172 31.8638 19.4948 36.3095 24C40.7553 28.5052 43.3187 34.1172 44 40.8361Z"
            fill="none"
            :stroke="hasPrev ? '#979797' : '#c4c4c4'"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button @click="next" :class="{ [style['disabled']]: !hasNext }">
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 40.8361C8.89307 34.8632 13.2383 31.4739 17.0356 30.6682C20.8329 29.8625 24.4483 29.7408 27.8818 30.303V41L44 23.5453L27.8818 7V17.167C21.5333 17.2172 16.1362 19.4948 11.6905 24C7.24474 28.5052 4.68126 34.1172 4 40.8361Z"
            fill="none"
            :stroke="hasNext ? '#979797' : '#c4c4c4'"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <contextmenu
      v-if="ctm"
      :position="contextmenuPos"
      :groups="menu"
      @click-item="onClickMenu"
    ></contextmenu>
  </div>
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

export default defineComponent({
  name: "Mindmap",
  components: {
    Contextmenu,
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
