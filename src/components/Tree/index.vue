<template>
  <div class="tree">
    <template v-for="(item, index) in data_source" :key="index">
      <Tree :item="item" :layer="[index]" class="first-layer" />
    </template>
  </div>
</template>

<script>
import Tree from "./Tree";
export default {
  props: {
    data: [],
    label: {
      type: String,
      default: "label",
    },
    children: {
      type: String,
      default: "children",
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    load: {
      type: Function,
      default: () => {},
    },
  },
  provide() {
    return {
      label: this.label,
      children: this.children,
      lazy: this.lazy,
      load: this.load,
      updateData: this.updateData,
      dragData: this.dragData,
    };
  },
  data() {
    return {
      tree_data: this.data,
    };
  },
  computed: {
    data_source() {
      if (Array.isArray(this.tree_data)) {
        return this.tree_data;
      } else {
        return [this.tree_data];
      }
    },
  },
  components: {
    Tree,
  },
  methods: {
    dragData(old_layer, new_layer, elem) {
      //数据拖拽
      const flag = old_layer.every((item, index) => {
        return item === new_layer[index];
      });
      if (flag) {
        //不能将元素拖拽给自己的子元素
        return false;
      }

      let result = [...this.data_source];

      const old_obj = this.getTarget(old_layer, result);

      const new_obj = this.getTarget(new_layer, result);

      const old_obj_parent = this.getTarget(
        old_layer.slice(0, old_layer.length - 1),
        result
      );

      const index = old_layer[old_layer.length - 1]; //获取倒数第二个索引

      if (!new_obj[this.children]) {
        new_obj[this.children] = [];
      }

      if (Array.isArray(old_obj_parent)) {
        old_obj_parent.splice(index, 1);
      } else {
        old_obj_parent[this.children].splice(index, 1); //原来位置的被拖拽数据删掉x
      }

      new_obj[this.children].unshift(old_obj); //将被拖拽的数据加到目标处

      this.tree_data = Array.isArray(this.tree_data) ? result : result[0];

      this.$nextTick(() => {
        !elem.is_open && elem.toggle(); //如果是关闭状态拖拽过去打开
      });
    },
    getTarget(layer, result) {
      if (layer.length == 0) {
        return result;
      }
      let data_obj;
      Array.from(Array(layer.length)).reduce((cur, prev, index) => {
        if (!cur) return null;
        if (index == 0) {
          data_obj = cur[layer[index]];
        } else {
          data_obj = cur[this.children][layer[index]];
        }
        return data_obj;
      }, result);
      return data_obj;
    },
    updateData(data) {
      const { data: list, layer } = data;

      let result = [...this.data_source];

      const tmp = this.getTarget(layer, result);

      tmp[this.children] = list;

      this.tree_data = Array.isArray(this.tree_data) ? result : result[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.first-layer {
  margin-bottom: 20px;
}
</style>
