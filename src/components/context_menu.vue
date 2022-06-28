<template>
  <div
    v-show="menuShow"
    class="context_menu"
    :style="{ top: Y + 'px', left: X + 'px' }"
  >
    <ul @mouseup="handleMouseUp">
      <li @click="change(0)">打开</li>
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
.context_menu {
  width: 60px;
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