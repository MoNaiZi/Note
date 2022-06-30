<template>
  <div class="tree">
    <div
      class="box"
      @click="toggle()"
      @dragstart="startDrag"
      @drop="dragEnd"
      @dragover="dragOver"
      draggable="true"
    >
      <div :class="['lt', getClassName()]"></div>
      <div class="label lt">{{ item[label] }}</div>
      <div class="lt load" v-if="loading_status">loading...</div>
    </div>
    <div class="drop-list" v-show="show_next">
      <template v-for="(child, index) in item[children]" :key="index">
        <Tree :item="child" :layer="[...layer, index]" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tree",
  props: {
    item: Object,
    layer: Array,
  },
  inject: ["label", "children", "lazy", "load", "updateData", "dragData"],
  data() {
    return {
      is_open: false, //是否打开下一级
      loading: false, //是否加载中
      loaded: false, //是否加载完毕
    };
  },
  computed: {
    show_next() {
      //是否显示下一级
      if (
        this.is_open === true &&
        (this.loaded === true || this.lazy === false)
      ) {
        return true;
      } else {
        return false;
      }
    },
    loading_status() {
      //控制loading...显示图标
      if (!this.lazy) {
        return false;
      } else {
        if (this.loading === true) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    getClassName() {
      if (this.item[this.children] && this.item[this.children].length > 0) {
        return this.is_open ? "down" : "right";
      } else {
        return "gap";
      }
    },
    dragOver(e) {
      e.preventDefault();
    },
    startDrag(e) {
      e.dataTransfer.setData("data", JSON.stringify(this.layer));
    },
    dragEnd(e) {
      e.preventDefault();
      const old_layer = JSON.parse(e.dataTransfer.getData("data"));
      this.dragData(old_layer, this.layer, this);
    },
    toggle() {
      if (this.lazy) {
        if (this.loaded) {
          //已经加载完毕
          this.is_open = !this.is_open;
          return false;
        }
        if (this.loading) {
          //正在加载中
          return false;
        }
        this.loading = true;
        const resolve = (data) => {
          this.is_open = !this.is_open;
          this.loading = false;
          this.loaded = true;
          this.updateData({ data, layer: this.layer });
        };
        const data = { ...this.item, layer: this.layer.length };
        this.load(data, resolve);
      } else {
        this.is_open = !this.is_open;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.lt {
  float: left;
}
.load {
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
}
.gap {
  margin-left: 10px;
  width: 1px;
  height: 1px;
}
.box::before {
  width: 0;
  height: 0;
  content: "";
  display: block;
  clear: both;
  cursor: pointer;
}
@mixin triangle() {
  border-color: #57af1a #fff #fff #fff;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  height: 0;
  width: 0;
}
.label {
  font-size: 14px;
  margin-left: 5px;
}
.down {
  @include triangle();
  margin-top: 8px;
}
.right {
  @include triangle();
  transform: rotate(-90deg);
  margin-top: 8px;
}
.drop-list {
  margin-left: 10px;
}
</style>