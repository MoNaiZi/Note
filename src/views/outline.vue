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
        @dragStart="dragStart"
        @dragOver="dragOver"
        @dragEnd="dragEnd"
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
      cursorPosition: -1,
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
    dragEnd(event, that) {
      console.log("结束", event, that);
      console.log(event.clientX);
      console.log(event.clientY);
    },
    dragOver(event, that) {
      console.log("拖拽中", event, that);
      console.log(event.clientX);
      console.log(event.clientY);
    },
    dragStart(event, that) {
      console.log("拖拽", event, that);
      console.log(event.clientX);
      console.log(event.clientY);
      event.dataTransfer.effectAllowed = "move";
    },
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
      this.Y = event.clientY + 20;
      this.showMenu = true;
    },
    collapse(data, node) {
      this.findNodeId(data, false, node);
    },
    expand(data) {
      this.findNodeId(data, true);
    },
    findNodeId(data, bool) {
      // console.log("idList", idList);
      // if (!idList.length) return;
      // console.log("node", node);
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
      // console.log("len", len);
      let range = document.createRange();
      let sel = window.getSelection();
      if (len > 0) {
        if (len > this.cursorPosition) {
          len = this.cursorPosition + 1;
        }
        if (len < this.cursorPosition) {
          len = this.cursorPosition - 1;
        }
      }
      // console.log("光标位置", len);
      range.setStart(node, len);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getName(data) {
      // console.log("event", event.currentTarget.selectionStart);
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
      const keyText = event.key;
      // console.log(event);
      const cursor = this.getCaretPosition(event.currentTarget);
      if (
        ["Enter", "Tab", "Backspace", "ArrowUp", "ArrowDown"].includes(keyText)
      ) {
        if (["Enter", "Tab"].includes(keyText)) {
          event.preventDefault();
        }
        if (keyText === "Backspace") {
          if (data.name.length) return;
        }
        const parent = node.parent;
        const expanded = node.expanded;
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
        // console.log("parentData ", parentData);
        let parentChild = parentData.child;
        if (!parentChild && Array.isArray(parentData)) {
          parentChild = parentData;
        }
        let index = parentChild.findIndex((item) => item.id === data.id);
        let expandedList = this.expandedList;

        if (keyText === "Enter") {
          if (data.level === 1) newObj.level = 1;

          if (data.level === 1 && (!cursor || !expanded)) {
            let insertIndex = this.treeData.findIndex(
              (item) => item.id === data.id
            );
            if (insertIndex === -1) insertIndex = 0;
            if (cursor) {
              insertIndex++;
            } else if (insertIndex > 0) {
              // insertIndex--;
            }
            this.treeData.splice(insertIndex, 0, newObj);
          } else {
            if (!node.childNodes.length) {
              if (cursor) {
                index++;
              }
              parentChild.splice(index, 0, newObj);
            } else {
              index = data.child.findIndex((item) => item.id === data.id);
              if (index >= 0) {
                data.child.splice(index, 0, newObj);
              } else {
                data.child.unshift(newObj);
              }
            }
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
            let childObj = {};
            if (index > 0) {
              childObj = parentChild[index - 1];
            }
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
          // debugger;
          if (data.level === 1) {
            const treeDataIndex = this.treeData.findIndex(
              (item) => item.id === data.id
            );
            this.treeData.splice(treeDataIndex, 1);
            if (treeDataIndex > 0) {
              newObj = this.treeData[treeDataIndex - 1];
            }
          } else {
            parentChild.splice(index, 1);
            let lastNodeObj = parentChild[parentChild.length - 1];
            if (lastNodeObj) {
              newObj = lastNodeObj;
            } else {
              newObj = JSON.parse(JSON.stringify(parentData));
            }
          }
          this.cursorPosition = newObj.name.length;
          // debugger;
          let expandedIndex = expandedList.findIndex(
            (item) => item === data.id
          );
          if (expandedIndex >= 0) {
            expandedList.splice(expandedIndex, 1);
          }
        } else if (["ArrowUp", "ArrowDown"].includes(keyText)) {
          // debugger;
          if (keyText === "ArrowUp") {
            if (index >= 1) {
              newObj = parentChild[index - 1];
            } else {
              newObj = parentData;
            }
            this.cursorPosition = newObj.name.length;
          } else {
            if (index >= 0 && parentChild.length - 1 > index) {
              newObj = parentChild[index + 1];
            } else {
              if (newObj.child && newObj.child.length) {
                newObj = newObj.child[0];
              }
            }
          }
        }
        this.treeData = JSON.parse(JSON.stringify(this.treeData));
        this.updateTree();
        const that = this;
        let sel = window.getSelection();
        sel.removeAllRanges();
        that.$nextTick(() => {
          let id = newObj.id;
          let div = document.getElementById(`${id}`);
          // console.log(div);
          if (div) {
            // div.focus();
            div.addEventListener(
              "focus",
              (e) => {
                // console.log("触发聚焦");
                e.preventDefault();
              },
              {
                capture: false,
                once: true,
              }
            );

            let focus = new Event("focus");
            div.dispatchEvent(focus);

            setTimeout(() => {
              that.customFocus(div.childNodes[0], newObj.name.length);
            }, 200);
          }
        });
      }
    },
    getCaretPosition(editableDiv) {
      let caretPos = 0,
        sel,
        range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
          var tempEl = document.createElement("span");
          editableDiv.insertBefore(tempEl, editableDiv.firstChild);
          var tempRange = range.duplicate();
          tempRange.moveToElementText(tempEl);
          tempRange.setEndPoint("EndToEnd", range);
          caretPos = tempRange.text.length;
        }
      }

      this.cursorPosition = caretPos;
      return caretPos;
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
            style="width: 47vw;outline: none;margin-left:10px;margin-top: 3px;"
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
