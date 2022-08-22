<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="($event) => this.handleContextMenu($event)"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked,
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    ref="node"
  >
    <div
      draggable="false"
      @dragstart.stop="handleDragStart"
      @dragover.stop="handleDragOver"
      @dragleave.stop="handleDragLeave"
      @dragend.stop="handleDragEnd"
      @drop.stop="handleDrop"
      class="el-tree-node__content"
      @mouseover="hover"
      @mouseout="mouseout"
      :style="{ 'padding-left': (node.level - 1) * tree.indent - -2 + 'px' }"
    >
      <!-- <i class="el-icon-more"></i> -->
      <div
        class="row"
        @mouseover="hover($event)"
        @mouseout="mouseout($event)"
        :style="styleFn(node)"
      >
        <i @click.stop="more(node)">
          <more theme="outline" size="22" fill="#979797" />
        </i>
        <i @click.stop="handleExpandIconClick" class="expandedBtn">
          <triangle
            :class="[
              {
                'is-leaf': node.isLeaf,
                expanded: !node.isLeaf && expanded,
                'no-left': !node.isLeaf,
              },
            ]"
            theme="filled"
            size="10"
            fill="#979797"
          />
        </i>
      </div>
      <div class="line" :id="`line_${node.data.id}}`"></div>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      >
      </span>
      <node-content :node="node"></node-content>
    </div>
    <!-- <collapse-transition> -->
    <!-- <transition-group> -->
    <div
      class="el-tree-node__children"
      v-if="!renderAfterExpand || childNodeRendered"
      v-show="expanded"
      role="group"
      :aria-expanded="expanded"
    >
      <el-tree-node
        :render-content="renderContent"
        v-for="child in node.childNodes"
        :render-after-expand="renderAfterExpand"
        :show-checkbox="showCheckbox"
        :key="getNodeKey(child)"
        :node="child"
        @node-expand="handleChildNodeExpand"
        @dragStart="dragStart"
        @dragOver="dragOver"
        @dragEnd="dragEnd"
        @dragLeave="dragLeave"
        @node-collapse="collapse"
        @more="more"
      >
      </el-tree-node>
    </div>
    <!-- </transition-group> -->
    <!-- </collapse-transition> -->
  </div>
</template>

<script type="text/jsx">
// import ElCollapseTransition from "element-ui/src/transitions/collapse-transition";
// import ElCheckbox from "element-ui/packages/checkbox";
// import collapseTransition from "../collapse-transition";
import { More, Triangle } from "@icon-park/vue-next";
import emitter from "./model/emitter";
import { getNodeKey } from "./model/util";
import mitt from "mitt";

const mittExample = mitt();
export default {
  name: "ElTreeNode",
  componentName: "ElTreeNode",
  mixins: [emitter],
  props: {
    node: {
      default() {
        return {};
      },
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    More,
    Triangle,
    NodeContent: {
      props: {
        node: {
          required: true,
        },
      },
      render(h) {
        const parent = this.$parent;
        const tree = parent.tree;

        const node = this.node;
        const data = node.data;
        const store = node.store;
        // console.log("this", this);
        // console.log("tree", tree);
        // console.log("parent", parent);
        return parent.renderContent ? (
          parent.renderContent.call(parent._renderProxy, h, {
            _self: tree,
            node,
            data,
            store,
          })
        ) : tree.$scopedSlots.default ? (
          tree.$scopedSlots.default({ node, data })
        ) : (
          <span class="el-tree-node__label">{node.label}</span>
        );
      },
    },
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null,
    };
  },

  watch: {
    "node.indeterminate"(val) {
      this.handleSelectChange(this.node.checked, val);
    },

    "node.checked"(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },

    "node.data.isExpand"(val) {
      this.initExpanded(val);
    },
  },

  methods: {
    initExpanded(bool) {
      bool === true ? true : false;
      this.expanded = bool;
      this.childNodeRendered = bool;
    },
    more(node) {
      this.$emit("more", node);
    },
    dragLeave(event, that) {
      this.$emit("dragLeave", event, that);
    },
    dragStart(event, that) {
      this.$emit("dragStart", event, that);
    },
    dragOver(event, that) {
      this.$emit("dragOver", event, that);
    },
    dragEnd(event, that) {
      this.$emit("dragEnd", event, that);
    },
    hover(event) {
      try {
        this.findRow(event, "inline-block");
      } catch (err) {
        // console.log(err);
      }
    },
    mouseout(event) {
      try {
        this.findRow(event, "none");
      } catch (err) {
        // console.log(err);
      }
    },
    findRow(event, str) {
      let list = Array.from(event.currentTarget.childNodes);
      let item = list.find((item) => item.className === "row");
      item.style.display = str;
    },
    styleFn(node) {
      let num = (node.level - 1) * this.tree.indent;
      num -= 39;
      let result = num + "px";
      return { left: result };
    },
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data);
    },

    handleSelectChange(checked, indeterminate) {
      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit("check-change", this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit(
        "current-change",
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      );
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !this.node.checked },
        });
      }
      this.tree.$emit("node-click", this.node.data, this.node, this);
    },

    handleContextMenu(event) {
      if (
        this.tree._events["node-contextmenu"] &&
        this.tree._events["node-contextmenu"].length > 0
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit(
        "node-contextmenu",
        event,
        this.node.data,
        this.node,
        this
      );
    },
    collapse(nodeData, node, instance) {
      this.$emit("node-collapse", nodeData, node, instance);
    },
    handleExpandIconClick() {
      // console.log("node-expand", this.node.isLeaf);
      // if (this.node.isLeaf) return;

      if (this.expanded) {
        this.$emit("node-collapse", this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit("node-expand", this.node.data, this.node, this);
      }
    },

    handleCheckChange(value, ev) {
      this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      this.$nextTick(() => {
        const store = this.tree.store;
        this.tree.$emit("check", this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys(),
        });
      });
    },

    handleChildNodeExpand(nodeData, node, instance) {
      // this.broadcast("ElTreeNode", "tree-node-expand", node);
      this.$emit("node-expand", nodeData, node, instance);
    },

    handleDragStart(event) {
      if (!this.tree.draggable) return;
      // this.tree.$emit("tree-node-drag-start", event, this);
      // const parent = this.$parent;
      // const tree = parent.tree;
      // tree.$emit("dragStart", event, this);
      this.$emit("dragStart", event, this);
    },

    handleDragOver(event) {
      if (!this.tree.draggable) return;

      // console.log("拖动中", event, this.node);
      this.$emit("dragOver", event, this);
      event.preventDefault();
    },
    handleDragLeave(event) {
      if (!this.tree.draggable) return;

      // console.log("拖动中", event, this.node);
      this.$emit("dragLeave", event, this);
    },

    handleDrop(event) {
      event.preventDefault();
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) return;

      // console.log("拖动结束", event, this.node);
      this.$emit("dragEnd", event, this);
    },
  },

  created() {
    const parent = this.$parent;
    // console.log("this", this);
    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;

    if (!tree) {
      console.warn("Can not find node's tree.");
    }

    const props = tree.props || {};
    const childrenKey = props["children"] || "children";
    this.initExpanded(this.node.data.isExpand);
    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    if (this.tree.accordion) {
      mittExample.on("tree-node-expand", (node) => {
        if (this.node !== node) {
          this.node.collapse();
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: none;
  position: absolute;
  left: -22px;
  top: 2px;
  z-index: 10;
  width: 45px;
  ::v-deep i:first-child {
    position: relative;
    top: 2px;
  }
  .is-leaf,
  .no-left {
    position: relative;
    top: -5px;
  }
  .no-left:hover {
    color: #000;
  }
}
// .row:hover {
//   .expanded {
//     color: #000;
//   }
// }
</style>