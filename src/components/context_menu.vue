<template>
  <div
    v-show="menuShow"
    class="context_menu"
    :style="{ top: Y + 'px', left: X + 'px' }"
  >
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="change(item.key)">
        {{ item.name }}
      </li>
      <!-- <li @click="change(0)" v-if="currentItem">
        {{ currentItem.isTopping ? "取消置顶" : "置顶" }}
      </li>
      <li @click="change(3)">右侧打开</li>
      <li @click="change(1)">删除</li> -->
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
interface MenuList {
  key: number;
  name: string;
}
export default defineComponent({
  props: {
    menuList: {
      type: Array as PropType<MenuList[]>,
      default: () => [
        {
          key: 2,
          name: "编辑",
        },
        {
          key: 0,
          name: "置顶",
        },
        {
          key: 3,
          name: "右侧打开",
        },
        {
          key: 1,
          name: "删除",
        },
      ],
    },
    X: {
      type: Number,
      default: 0,
    },
    Y: {
      type: Number,
      default: 0,
    },
    menuShow: {
      type: Boolean,
      default: false,
    },
    currentItem: {
      type: Object,
      value: {},
    } as any,
  },
  watch: {
    currentItem: {
      deep: true,
      handler(val) {
        if (!val) return;
        let txt = "置顶";
        if (val.isTopping) {
          txt = "取消置顶";
        }
        let index = this.list.findIndex((item: any) => item.key === 0);
        if (index >= 0) {
          this.list[index].name = txt;
        }
      },
    },
  },
  data() {
    return {
      list: this.menuList,
    };
  },
  methods: {
    change(type: number) {
      this.$emit("change", type);
    },
  },
});
</script>

<style scoped lang="scss">
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
  cursor: pointer;
}
.context_menu {
  z-index: 99;
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