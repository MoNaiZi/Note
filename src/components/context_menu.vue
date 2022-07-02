<template>
  <div
    v-show="menuShow"
    class="context_menu"
    :style="{ top: Y + 'px', left: X + 'px' }"
  >
    <ul @mouseup="handleMouseUp">
      <li @click="change(2)">打开</li>
      <!-- <li @click="change(3)">预览</li> -->
      <li @click="change(0)">
        {{ currentItem.isTopping ? "取消置顶" : "置顶" }}
      </li>
      <li @click="change(4)">设置</li>
      <li @click="change(1)">删除</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    X: {
      type: Number,
      value: 0,
    },
    Y: {
      type: Number,
      value: 0,
    },
    menuShow: {
      type: Boolean,
      value: false,
    },
    currentItem: {
      type: Object,
      value: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    change(type) {
      this.$emit("change", type);
    },
    handleMouseUp() {},
  },
};
</script>

<style scoped lang="scss">
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.context_menu {
  z-index: 10;
  width: 84px;
  border-radius: 5px;
  box-shadow: 0 0 4px #cbcbcb;
  cursor: default;
  position: absolute;
  background: #fff;
  li {
    padding: 5px;
  }
}
</style>