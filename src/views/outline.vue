<template>
  <div>
    <div class="divider"></div>
    <div class="header">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item
          ><span class="item" @click="goBack">{{
            header.title
          }}</span></el-breadcrumb-item
        >
        <el-breadcrumb-item v-for="(item, index) in HierarchyList" :key="index"
          ><span class="item" @click="goBack(item)">{{
            item.name
          }}</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <!-- <div class="divider"></div> -->
    <div class="ly-tree-container">
      <zmy-tree
        node-key="id"
        :draggable="true"
        :treeData="treeData"
        :props="defaultProps"
        :default-expanded-keys="expandedList"
        :expand-on-click-node="false"
        :render-content="renderContent"
        @more="more"
        @node-drag-start="handleDragStart"
        @node-collapse="collapse"
        @node-expand="expand"
      >
      </zmy-tree>
    </div>
  </div>

  <contextMenu
    :X="X"
    :Y="Y"
    :menuShow="showMenu"
    @change="changeMenu"
    :menuList="menuList"
  ></contextMenu>
</template>

<script>
// const getServiceTree = function () {
//   return [
//     {
//       id: 1,
//       name: "技术部",
//       level: 1,
//       child: [
//         {
//           id: 2,
//           name: "运维组",
//           level: 2,
//           child: [
//             {
//               id: 3,
//               name: "godo",
//               level: 3,
//               child: [
//                 {
//                   id: 66,
//                   name: "最后一层",
//                   level: 4,
//                   child: [
//                     {
//                       id: 77,
//                       name: "1111",
//                       level: 5,
//                       child: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 4,
//           name: "测试组",
//           level: 2,
//           child: [],
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "运营组",
//       level: 1,
//       child: [
//         {
//           id: 8,
//           name: "销售",
//           level: 2,
//           child: [
//             {
//               id: 5,
//               name: "godo",
//               level: 3,
//               child: [],
//             },
//           ],
//         },
//         {
//           id: 5,
//           name: "推广",
//           level: 2,
//           child: [],
//         },
//       ],
//     },
//   ];
// };
import zmyTree from "@/components/newTree/tree.vue";
import contextMenu from "@/components/context_menu.vue";
import { store } from "@/store";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
const dayjs = require("dayjs");
import { getQueryByName } from "@/utils";
// import mitt from "mitt";

// const mittExample = mitt();
export default {
  components: {
    zmyTree,
    contextMenu,
  },
  computed: {
    ...mapState("header", {
      header: (state) => state.note,
      headerClose: (state) => state.close,
    }),
  },
  data() {
    return {
      X: 0,
      Y: 0,
      showMenu: false,
      menuList: [
        {
          key: 0,
          name: "完成",
        },
        {
          key: 1,
          name: "编辑描述",
        },
        {
          key: 2,
          name: "删除",
        },
      ],
      tree: [],
      expandedList: [],
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name",
      },
      HierarchyList: [],
    };
  },
  props: {
    currentItem: {
      type: Object,
      default() {
        return {};
      },
    },
    setPageTypeText: {
      type: String,
      default: "outline",
    },
  },
  watch: {
    setPageTypeText: function () {
      store.dispatch("header/setPageTypeText", this.setPageTypeText);
    },
    currentItem: {
      deep: true,
      handler() {
        this.init();
      },
    },
    headerClose: {
      deep: true,
      handler(val) {
        if (val) return;
        this.saveTree();
      },
    },
  },
  async created() {
    store.dispatch("header/setPageTypeText", this.setPageTypeText);
    await this.init();

    window.addEventListener("click", () => {
      this.showMenu = false;
    });
    window.addEventListener("keydown", (e) => {
      let keyCode = e.keyCode;
      if (e.key === "s" && keyCode === 83) {
        console.log("保存");
        this.saveTree("save");
        this.$message({
          message: "保存成功",
          type: "success",
          duration: 1000,
        });
      }
    });
  },

  methods: {
    async init() {
      let winId = getQueryByName("winId");
      let note = {};
      if (winId === "undefined") {
        note._id = this.$createdId();
      } else {
        note = JSON.parse(JSON.stringify(this.currentItem));
        if (JSON.stringify(note) === "{}") {
          note = await ipcRenderer.invoke("getNote", winId);
        }
        this.expandedList = JSON.parse(JSON.stringify(note.expandedList || []));
        this.tree = JSON.parse(JSON.stringify(note.tree || []));
        if (note.title) {
          store.dispatch("header/setIsEditedTitle", false);
        }
      }
      if (!note.tree) {
        let id = this.$createdId();
        this.tree.push({
          id,
          name: "",
          level: 1,
          child: [],
        });
        this.refresh();
        this.$nextTick(() => {
          let div = document.getElementById(`${id}`);
          // console.log("div", div);
          div.focus();
        });
      } else {
        this.refresh();
      }
      delete note.tree;
      delete note.expandedList;
      store.dispatch("header/setNote", note || {});
    },
    saveTree(typeText) {
      let { timing } = this.header;
      const note = this.header;
      const tree = this.tree;
      const expandedList = this.expandedList;
      // // const text = this.editor.getText();
      let tempOjb = { tree, expandedList, ...note };
      tempOjb.title = tempOjb.title || "无标题";
      tempOjb.modeType = 1;
      if (timing) {
        tempOjb.timing = timing;
        tempOjb.timinGtimeStamp = dayjs(timing).valueOf();
        tempOjb.timingStatus = 0;
      }

      ipcRenderer.send(
        "closeEdited",
        note._id,
        JSON.parse(JSON.stringify(tempOjb)),
        typeText
      );
      if (typeText != "save") {
        store.dispatch("header/setHeaderClose", false);
      }
    },
    changeMenu() {
      this.showMenu = false;
    },
    more(node) {
      console.log(node);
      this.X = event.clientX;
      this.Y = event.clientY;
      this.showMenu = true;
    },
    collapse(data, node) {
      this.findNodeId(data, false, node);
    },
    expand(data) {
      this.findNodeId(data, true);
    },
    findNodeId(data, bool, node) {
      // console.log("idList", idList);
      // if (!idList.length) return;
      console.log("node", node);
      if (bool) {
        this.expandedList.push(data.id);
      } else {
        let idList = [];
        const fn = function (array) {
          if (array.length) {
            for (let item of array) {
              idList.push(item.id);
              if (item.child.length) {
                fn(item.child);
              }
            }
          }
          return;
        };
        fn(data.child);
        idList.forEach((id) => {
          let i = this.expandedList.findIndex((item) => item === id);
          this.expandedList.splice(i, 1);
        });
      }
      this.updateTree();
    },
    handleDragStart(node) {
      console.log("drag start", node);
    },
    refresh() {
      this.treeData = JSON.parse(JSON.stringify(this.tree));
    },
    customFocus(node, len) {
      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart(node, len);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getName(data) {
      // console.log("event", event.currentTarget.childNodes);

      let value = event.currentTarget.innerText;
      data.name = value;
      // console.log("data", data);
      event.currentTarget.innerText = value;
      this.updateTree();
      this.$nextTick(() => {
        this.customFocus(event.currentTarget.childNodes[0], value.length);
      });
    },
    goBack(data) {
      if (!data.child) {
        this.refresh();
        this.HierarchyList = [];
        return;
      }
      let index = this.HierarchyList.findIndex((item) => item.id === data.id);
      if (index >= 0) {
        this.HierarchyList = this.HierarchyList.slice(0, index + 1);
      }
      this.treeData = data.child;
    },
    toChild(data) {
      let index = this.HierarchyList.findIndex((item) => item.id === data.id);
      if (index === -1) {
        this.HierarchyList.push(data);
        let child = data.child;

        if (!child.length) {
          child = [
            {
              child: [],
              name: "",
            },
          ];
        }
        this.treeData = child;
      }
    },
    mouseover(node) {
      if (node.expanded || !node.childNodes.length) {
        event.currentTarget.style.background = "#cfcfcf";
      }
    },
    mouseout(node) {
      if (node.expanded || !node.childNodes.length) {
        event.currentTarget.style.background = "#fff";
      }
    },
    updateTree() {
      let tree = JSON.parse(JSON.stringify(this.treeData));
      this.tree = tree;
      this.$emit("onChangeTree", tree, this.expandedList);
    },
    shortcutKey(node, data) {
      let keyText = event.key;
      // console.log(event);
      // console.log(keyText);
      if (["Enter", "Tab", "Backspace"].includes(keyText)) {
        if (["Enter", "Tab"].includes(keyText)) {
          event.preventDefault();
        }
        if (keyText === "Backspace") {
          if (data.name.length) return;
        }
        const parent = node.parent;
        // console.log("node", node);

        let parentData = parent.data;
        let newObj = {
          id: this.$createdId(),
          level: parent.level + 1,
          child: [],
          name: "",
        };
        if (data && keyText != "Enter") {
          newObj = JSON.parse(JSON.stringify(data));
        }
        let parentChild = parentData.child || [];
        let index = parentChild.findIndex((item) => item.id === data.id);
        let expandedList = this.expandedList;

        if (keyText === "Enter") {
          if (data.level === 1) newObj.level = 1;

          if (index === -1 && node.level === 1) {
            this.treeData.push(newObj);
          } else {
            parentChild.splice(index + 1, 0, newObj);
          }
          expandedList.push(newObj.id);
        } else if (keyText === "Tab") {
          const shiftKey = event.shiftKey;
          if (parent.childNodes.length > 1 && !shiftKey) {
            newObj.level++;
            if (index === -1) {
              parentChild = this.treeData;
              index = parentChild.findIndex((item) => item.id === data.id);
            }
            parentChild.splice(index, 1);
            let childObj = parentChild[parentChild.length - 1];
            childObj.child.splice(index, 0, newObj);
          } else if (shiftKey) {
            index = parentChild.findIndex((item) => item.id === data.id);
            parentChild.splice(index, 1);
            newObj.level--;
            if (parent.parent && !Array.isArray(parent.parent.data)) {
              parent.parent.data.child.push(newObj);
            } else if (parent && parent.data) {
              const treeDataIndex = this.treeData.findIndex(
                (item) => item.id === data.id
              );
              if (treeDataIndex === -1) {
                this.treeData.push(newObj);
              }
            }
          }
        } else if (
          keyText === "Backspace" &&
          !data.name.length &&
          !data.child.length
        ) {
          event.preventDefault();
          parentChild.splice(index, 1);
          let lastNodeObj = parentChild[parentChild.length - 1];
          if (lastNodeObj) {
            newObj = lastNodeObj;
          } else {
            newObj = JSON.parse(JSON.stringify(parentData));
          }
          let expandedIndex = expandedList.findIndex(
            (item) => item === data.id
          );
          if (expandedIndex >= 0) {
            expandedList.splice(expandedIndex, 1);
          }
        }
        this.treeData = JSON.parse(JSON.stringify(this.treeData));
        this.updateTree();
        const that = this;
        that.$nextTick(() => {
          let div = document.getElementById(`${newObj.id}`);
          // console.log("div", div);
          if (div) {
            // div.focus();
            div.addEventListener(
              "focus",
              (e) => {
                e.preventDefault();
              },
              {
                capture: false,
                once: true,
              }
            );
            let focus = new Event("focus");
            div.dispatchEvent(focus);
            that.customFocus(div.childNodes[0], newObj.name.length);
          }
        });
      }
    },
    renderContent(h, { node, data }) {
      // console.log("node", node, "data", data, _self);
      data = data || {};
      return (
        <div class="ly-tree-node" onClick={() => (this.showMenu = false)}>
          <li
            onClick={() => this.toChild(data)}
            onMouseover={() => this.mouseover(node)}
            onMouseout={() => this.mouseout(node)}
            style={{
              background: node.isLeaf || node.expanded ? "#fff" : "#cfcfcf",
            }}
          ></li>
          <div
            id={data.id}
            onInput={() => this.getName(data)}
            style="width: 100%;outline: none;margin-left:10px;"
            contenteditable="true"
            onKeydown={() => this.shortcutKey(node, data)}
          >
            {data.name}
          </div>
        </div>
      );
    },
  },
};
</script>
<style  lang="scss" scoped>
.header {
  margin-left: 20px;
  margin-bottom: 15px;
  margin-top: 20px;
  .item {
    box-shadow: 0 0 4px #cbcbcb;
    padding: 7px;
    border-radius: 5px;
    cursor: pointer;
  }
  span {
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
