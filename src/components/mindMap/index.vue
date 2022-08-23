<template>
  <div class="mind_map">
    <mindmap
      class="left-bottom"
      v-model="tree"
      :branch="rangeList['branch'].value"
      :x-gap="rangeList['x-gap'].value"
      :y-gap="rangeList['y-gap'].value"
      :zoom="checkboxList['zoom'].value"
      :fit-btn="checkboxList['fit-btn'].value"
      :center-btn="checkboxList['center-btn'].value"
      :download-btn="checkboxList['download-btn'].value"
      :drag="checkboxList['drag'].value"
      :edit="checkboxList['edit'].value"
      :add-node-btn="checkboxList['add-node-btn'].value"
      :sharp-corner="checkboxList['sharp-corner'].value"
      :ctm="checkboxList['contextmenu'].value"
      :timetravel="checkboxList['timetravel'].value"
      @update:model-value="onChange"
      @changeScaleData="changeScaleData"
      :locale="locale"
      :setting="setting"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
// const d3 = require("d3");
import Mindmap from "./mind_map";
import tempData from "./data.json";
export default {
  data() {
    return {
      locale: "zh",
      checkboxList: {
        "center-btn": { value: true },
        "fit-btn": { value: true },
        timetravel: { value: true },
        "download-btn": { value: true },
        "add-node-btn": { value: true },
        keyboard: { value: false, disabled: true },
        zoom: { value: true },
        drag: { value: true },
        edit: { value: true },
        contextmenu: { value: true },
        "sharp-corner": { value: false },
        vertical: { value: false, disabled: true },
      },
      rangeList: {
        branch: { value: 4, min: 1, max: 6 },
        "x-gap": { value: 84, min: 0, max: 100 },
        "y-gap": { value: 18, min: 0, max: 100 },
      },
      tempData,
      tree: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const treeData = JSON.parse(JSON.stringify(this.treeData));
      const title = JSON.parse(JSON.stringify(this.header.title));
      this.tree = [
        {
          name: title,
          level: 0,
          id: "root",
          children: treeData,
          isExpand: true,
        },
      ];
    },
    onChange() {
      this.$emit("change", this.tree);
    },
    changeScaleData(data) {
      this.$emit("changeScaleData", data);
    },
  },
  components: {
    Mindmap,
  },
  computed: {
    ...mapState("header", {
      header: (state) => state.note,
    }),
  },
  props: {
    treeData: [],
    setting: {},
  },
  watch: {
    "header.title": function () {
      this.init();
    },
    treeData: {
      deep: true,
      handler() {
        this.init();
      },
    },
  },
};
</script>

<style scoped>
.mind_map {
  height: 96vh;
  background: #f2f2f2;
  outline: 0;
  overflow: hidden;
}
</style>