<template>
  <div class="mind_map">
    <div id="mind_map_wrap" ref="mind_map_wrap"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const d3 = require("d3");
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
          child: val,
        };
      },
    },
  },
  data() {
    return {
      tree: {},
    };
  },
  mounted() {
    const mindData = {
      data: {
        id: " root",
        topic: "Matomo",
        children: [
          {
            id: "2",
            topic: "222",
            "background-color": "#1abc9c",
            children: [{ topic: "333", children: [] }],
          },
          {
            id: "events",
            topic: "Custom Events",
            "background-color": "#1abc9c",
            children: [
              {
                id: "reporting",
                topic: "Reporting",
                "background-color": "#34495e",
                tag: "MATOMO_REPORTS",
                children: [
                  {
                    id: "111068",
                    "background-color": "#ffc107",
                    topic:
                      '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111068/">Case 111068 - Customize Matomo to support reports</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": null,
                  },
                  {
                    id: "111538",
                    "background-color": "#ffc107",
                    topic:
                      '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111538/">Case 111538 - Investigate how Matomo might track which report parameters are used</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": null,
                  },
                ],
              },
              {
                id: "searching",
                topic: "Search Pages",
                "background-color": "#34495e",
                tag: "MATOMO_SEARCHING",
                children: [
                  {
                    id: "111069",
                    "background-color": "#28a745",
                    topic:
                      '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111069/">Case 111069 - Customize Matomo to support filters, pagination, show more activity on REACT pages</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": null,
                  },
                  {
                    id: "111587",
                    "background-color": "#ffc107",
                    topic:
                      '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111587/">Case 111587 - Customize Matomo to support sorting activity on BACKBONE pages</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": null,
                  },
                  {
                    id: "111606",
                    "background-color": "#ffc107",
                    topic:
                      '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111606/">Case 111606 - Customize Matomo to support filter, show more, pagination activity on BACKBONE pages</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": null,
                  },
                  {
                    id: "111616",
                    "background-color": "#28a745",
                    topic:
                      '<i title="View QA Downstream Notes" data-toggle="modal" data-target="#qaNotesModal111616" class="fa fa-file-text-o" style="cursor:pointer; margin-left: 5px;"></i><a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111616/">Case 111616 - Customize Matomo to support column selector and sort activity on REACT pages</a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": "#qaNotesModal111616",
                  },
                ],
              },
              {
                id: "other",
                topic: "Other",
                "background-color": "#34495e",
                tag: "MATOMO_EVENTS",
                children: [
                  {
                    id: "111070",
                    "background-color": "#28a745",
                    topic:
                      '<i title="View QA Downstream Notes" data-toggle="modal" data-target="#qaNotesModal111070" class="fa fa-file-text-o" style="cursor:pointer; margin-left: 5px;"></i><a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111070/">Case 111070 - Add customization so Matomo can analyze modal activity </a>',
                    href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                    "data-target": "#qaNotesModal111070",
                  },
                ],
              },
            ],
          },
          {
            id: "legal",
            topic: "Rollout",
            "background-color": "#1abc9c",
            tag: "MATOMO_ROLLOUT",
            children: [
              {
                id: "104570",
                "background-color": "#007bff",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/104570/">Case 104570 - Investigate adding Matomo to Base Platform</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
              {
                id: "108842",
                "background-color": "#dc3545",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/108842/">Case 108842 - Matomo User-level tracking opt-in </a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
              {
                id: "110929",
                "background-color": "#28a745",
                topic:
                  '<i title="View QA Downstream Notes" data-toggle="modal" data-target="#qaNotesModal110929" class="fa fa-file-text-o" style="cursor:pointer; margin-left: 5px;"></i><a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/110929/">Case 110929 - Add out-of-the-box Matomo analytics to Platform</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": "#qaNotesModal110929",
              },
              {
                id: "110930",
                "background-color": "#ffc107",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/110930/">Case 110930 - Investigate using Matomo for/with MTT apps</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
              {
                id: "111180",
                "background-color": "#ffc107",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111180/">Case 111180 - Investigate default configurable privacy settings for Matomo</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
              {
                id: "111670",
                "background-color": "#007bff",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111670/">Case 111670 - Reminder to create a resource that documents Matomo mapping e.g., what categories represent</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
              {
                id: "111918",
                "background-color": "#dc3545",
                topic:
                  '<a target="_blank" href="https://fogbugz.forteresearch.com/f/cases/111918/">Case 111918 - Matomo - remove numeric identifiers from tracked URLs</a>',
                href: "https://fogbugz.forteresearch.com/f/cases/${ c.ixBug }/",
                "data-target": null,
              },
            ],
          },
        ],
      },
    };
    const that = this;
    const wrap = document.getElementById("mind_map_wrap");
    const width = 1200;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const dx = 40;
    const dy = width / 6;
    console.log("d3", d3);
    const tree = d3.tree().nodeSize([dx, dy]);

    const diagonal = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);

    const createChart = (data) => {
      const root = d3.hierarchy(data);

      root.x0 = dy / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth > 5) d.children = null;
      });
      // const { height } = wrap.getBoundingClientRect();
      let svg = d3
        .create("svg")
        .attr("viewBox", [-margin.left, -margin.top, width - margin.left, dx])
        .style("font", "10px sans-serif")
        .style("user-select", "none")
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
            d.children = d.children ? null : d._children;
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
          .attr("data-toggle", (d) => (d.data["data-target"] ? "modal" : null));
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
          .attr("y", (d) => (d._children ? "-2em" : 0))
          .attr("text-anchor", (d) => (d._children ? "middle" : "start"))
          .html((d) => d.data.topic)
          .attr("x", (d) => (d._children ? 0 : dx / 3 + 4));
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

    const dachart = createChart(mindData.data);

    //var svg = d3.select("#cy").append("svg")

    wrap.append(dachart);
  },
  methods: {},
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