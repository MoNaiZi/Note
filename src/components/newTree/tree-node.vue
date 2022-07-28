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
      :draggable="tree.draggable"
      @dragstart.stop="handleDragStart"
      @dragover.stop="handleDragOver"
      @dragend.stop="handleDragEnd"
      @drop.stop="handleDrop"
      class="el-tree-node__content"
      @mouseover="hover"
      @mouseout="mouseout"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }"
    >
      <!-- <i class="el-icon-more"></i> -->
      <div
        class="row"
        @mouseover="hover($event)"
        @mouseout="mouseout($event)"
        :style="styleFn(node)"
      >
        <el-icon @click.stop="more(node)">
          <MoreFilled />
        </el-icon>

        <!-- <span
          @click.stop="handleExpandIconClick"
          :class="[
            { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
            'el-tree-node__expand-icon',
            tree.iconClass ? tree.iconClass : 'el-icon-caret-right',
          ]"
        >
        </span> -->
        <el-icon
          @click.stop="handleExpandIconClick"
          :class="[
            {
              'is-leaf': node.isLeaf,
              expanded: !node.isLeaf && expanded,
              'no-left': !node.isLeaf,
            },
            'el-tree-node__expand-icon',
          ]"
        >
          <component :is="'CaretRight'"></component>
        </el-icon>
      </div>

      <!-- <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange"
      >
      </el-checkbox> -->
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      >
      </span>
      <node-content :node="node"></node-content>
    </div>
    <!-- <el-collapse-transition> -->
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
        @node-collapse="collapse"
        @more="more(node)"
      >
      </el-tree-node>
    </div>
    <!-- </el-collapse-transition> -->
  </div>
</template>

<script type="text/jsx">
// import ElCollapseTransition from "element-ui/src/transitions/collapse-transition";
// import ElCheckbox from "element-ui/packages/checkbox";
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
    // ElCollapseTransition,
    // ElCheckbox,
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

    "node.expanded"(val) {
      this.$nextTick(() => (this.expanded = val));
      if (val) {
        this.childNodeRendered = true;
      }
    },
  },

  methods: {
    more(node) {
      this.$emit("more", node);
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
        event.currentTarget.childNodes[1].style.display = "inline-block";
      } catch (err) {
        // console.log(err);
      }
    },
    mouseout(event) {
      try {
        event.currentTarget.childNodes[1].style.display = "none";
      } catch (err) {
        // console.log(err);
      }
    },
    styleFn(node) {
      let num = (node.level - 1) * this.tree.indent;
      num -= 35;
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
      // console.log("node-expand", this.expanded);
      if (this.node.isLeaf) return;
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
      this.$emit("dragOver", event, this);
      event.preventDefault();
    },

    handleDrop(event) {
      event.preventDefault();
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) return;
      this.$emit("dragEnd", event, this);
    },
  },

  created() {
    const parent = this.$parent;

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

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

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
  top: 0px;
  z-index: 10;
  width: 45px;
  ::v-deep i:first-child {
    position: relative;
    top: 2px;
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