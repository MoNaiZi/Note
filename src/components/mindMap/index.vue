<template>
  <div class="mind_map">
    <div id="mind_map_wrap" ref="mind_map_wrap"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const d3 = require("d3");
const mindData = {
  id: " root",
  name: "Matomo",
  children: [
    {
      id: "events",
      name: "Custom Events",
      "background-color": "#1abc9c",
      children: [
        {
          id: "reporting",
          name: "Reporting",
          "background-color": "#34495e",
          tag: "MATOMO_REPORTS",
          children: [
            {
              id: "111068",
              "background-color": "#ffc107",
              name: 2222,
            },
            {
              id: "111538",
              "background-color": "#ffc107",
              name: "2222",
              "data-target": null,
            },
          ],
        },
        {
          id: "searching",
          name: "Search Pages",
          "background-color": "#34495e",
          tag: "MATOMO_SEARCHING",
          children: [
            {
              id: "111069",
              "background-color": "#28a745",
              name: "2222",
              "data-target": null,
            },
            {
              id: "111587",
              "background-color": "#ffc107",
              name: "2222",
              "data-target": null,
            },
            {
              id: "111606",
              "background-color": "#ffc107",
              name: "222222",
              "data-target": null,
            },
            {
              id: "111616",
              "background-color": "#28a745",
              name: "222",
              "data-target": "#qaNotesModal111616",
            },
          ],
        },
        {
          id: "other",
          name: "Other",
          "background-color": "#34495e",
          tag: "MATOMO_EVENTS",
          children: [
            {
              id: "111070",
              "background-color": "#28a745",
              name: '<i title="View QA Downstream Notes" data-toggle="modal" data-target="#qaNotesModal111070" class="fa fa-file-text-o" style="cursor:pointer; margin-left: 5px;"></i><a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111070/">Case 111070 - Add customization so Matomo can analyze modal activity </a>',
              href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
              "data-target": "#qaNotesModal111070",
            },
          ],
        },
      ],
    },
  ],
};
export default {
  computed: {
    ...mapState("header", {
      header: (state) => state.note,
    }),
  },
  props: {
    treeData: [],
  },
  watch: {
    treeData: {
      deep: true,
      handler(val) {
        const that = this;
        this.tree = {
          name: that.header.title,
          id: "root",
          children: val,
        };
        this.init();
      },
    },
  },
  data() {
    return {
      tree: {},
    };
  },
  created() {
    this.tree = this.treeData;
  },
  mounted() {},
  methods: {
    init() {
      const that = this;
      const wrap = document.getElementById("mind_map_wrap");
      const width = 1200;
      const margin = { top: 40, right: 40, bottom: 40, left: 40 };
      const dx = 40;
      const dy = width / 6;

      const tree = d3.tree().nodeSize([dx, dy]);

      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);

      const createChart = (data) => {
        const root = d3.hierarchy(data, function (d) {
          return d.children;
        });

        console.log("root", root);
        // debugger;
        root.x0 = dy / 2;
        root.y0 = 0;
        root.descendants().forEach((d, i) => {
          console.log("d", d);
          // debugger;
          d.id = i;
          d._children = d.children;
          // if (!d._child && d.data) d._child = d.data.children;
          if (d.depth > 5) d.children = null;
        });
        // const { height } = wrap.getBoundingClientRect();
        let svg = d3
          .create("svg")
          .attr("viewBox", [-margin.left, -margin.top, width - margin.left, dx])
          .style("font", "10px sans-serif")
          .style("user-select", "none")
          .style("width", "100%")
          .style("height", "100%")
          .call(
            d3
              .zoom()
              .scaleExtent([1 / 2, 8])
              .on("zoom", (e) => {
                let g = d3.select("svg g");
                g.attr("transform", e.transform);
              })
          );
        let gMain = svg.append("g");
        that.svg = svg;
        const gLink = gMain
          .append("g")
          .attr("fill", "none")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 1.0)
          .attr("stroke-width", 1.5);

        const gNode = gMain
          .append("g")
          .attr("cursor", "pointer")
          .attr("pointer-events", "all");

        function update(source) {
          const duration = d3.event && d3.event.altKey ? 2500 : 250;
          const nodes = root.descendants().reverse();
          const links = root.links();

          // Compute the new tree layout.
          tree(root);

          let left = root;
          let right = root;
          root.eachBefore((node) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
          });

          const height = right.x - left.x + margin.top + margin.bottom;

          const transition = svg
            .transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            .tween(
              "resize",
              window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
            );

          // Update the nodes…
          const node = gNode.selectAll("g").data(nodes, (d) => d.id);

          // Enter any new nodes at the parent's previous position.
          const nodeEnter = node
            .enter()
            .append("g")
            .attr("transform", () => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (d) => {
              d.children = d.children ? null : d._child;
              update(d);
            });

          // const folderClosed = "\uf07b";
          const pageIcon = "\uf0f6";

          const desat = (c) => d3.hsl(c.h, c.s, c.l + 0.0);

          // The circle
          nodeEnter
            .append("circle")
            .attr("r", dx / 3)
            .attr("fill", (d) => desat(d3.hsl(d.data["background-color"])))
            .attr("fill-opacity", 1)
            .attr("stroke", (d) => d.data["background-color"])
            .attr("data-target", (d) =>
              d.data["data-target"] ? d.data["data-target"] : null
            )
            .attr("data-toggle", (d) =>
              d.data["data-target"] ? "modal" : null
            );
          // Icon for QA text
          nodeEnter
            .filter((d) => d.data["data-target"])
            .append("text")
            .attr("x", -6)
            .attr("y", 6)
            .attr("font-family", "FontAwesome")
            .attr("font-size", function () {
              return "16px";
            })
            .attr("data-target", (d) => d.data["data-target"])
            .attr("data-toggle", "modal")
            .text(pageIcon);
          // Transition nodes to their new position.
          node
            .merge(nodeEnter)
            .transition(transition)
            .attr("transform", (d) => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

          // Link and text of each node
          const labels = nodeEnter
            .append("a")
            .attr("href", (d) => d.data.href)
            .append("text")
            .attr("dy", "0.31em")
            .attr("y", (d) => (d._child ? "-2em" : 0))
            .attr("text-anchor", (d) => (d._child ? "middle" : "start"))
            .html((d) => d.data.name)
            .attr("x", (d) => (d._child ? 0 : dx / 3 + 4));
          window.setTimeout(() => labels.call(wrapText, 300), 0);

          // Transition exiting nodes to the parent's new position.
          node
            .exit()
            .transition(transition)
            .remove()
            .attr("transform", () => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

          // Update the links…
          const link = gLink.selectAll("path").data(links, (d) => d.target.id);

          // Enter any new links at the parent's previous position.
          const linkEnter = link
            .enter()
            .append("path")
            .attr("d", () => {
              const o = { x: source.x0, y: source.y0 };
              return diagonal({ source: o, target: o });
            });

          // Transition links to their new position.
          link.merge(linkEnter).transition(transition).attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link
            .exit()
            .transition(transition)
            .remove()
            .attr("d", () => {
              const o = { x: source.x, y: source.y };
              return diagonal({ source: o, target: o });
            });

          // Stash the old positions for transition.
          root.eachBefore((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }

        update(root);

        return svg.node();
      };

      const wrapText = function (text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // em
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text
              .text(null)
              .append("tspan")
              .attr("x", this.getAttribute("x"))
              .attr("y", y)
              .attr("dy", dy + "em");
          console.log(words);
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            console.log(tspan.node().getComputedTextLength());
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text
                .append("tspan")
                .attr("x", this.getAttribute("x"))
                .attr("y", y)
                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(word);
            }
          }
        });
      };
      const treeData = this.tree;

      const dachart = createChart(treeData);
      console.log("treeData", treeData);
      console.log(mindData);
      //var svg = d3.select("#cy").append("svg")

      wrap.append(dachart);
    },
  },
};
</script>

<style scoped>
#mind_map_wrap {
  height: 96vh;
  background: #f2f2f2;
  outline: 0;
  overflow: hidden;
}
</style>