import * as d3 from "d3";

/**
 * Initialize and manage D3 tree rendering
 * @param {SVGElement} svgElement - SVG DOM element reference
 * @param {Object} QASBA_CONFIG - Configuration with qasbaName, defaultFocusId, jsonData
 * @param {Function} onNodeClick - Callback when node is clicked: (nodeData, popupPos) => void
 * @param {Function} setSection - Optional callback for cross-family navigation: (qasbaName) => void
 */
export const initializeTree = (svgElement, QASBA_CONFIG, onNodeClick, setSection) => {
   if (!svgElement) return { peopleList: [] };

   try {
      const width = window.innerWidth - 280;
      const height = window.innerHeight - 140;

      const svg = d3.select(svgElement);
      svg.attr("width", width).attr("height", height);
      svg.selectAll("*").remove();

      console.log("Drawing tree for " + QASBA_CONFIG.qasbaName);
      const root = d3.hierarchy(QASBA_CONFIG.jsonData);
      const treeLayout = d3.tree().nodeSize([240, 180]);
      treeLayout(root);

      // Build searchable people list (persons + spouses)
      const peopleList = [];
      root.descendants().forEach((d) => {
         if (d.data && d.data.name) {
            peopleList.push({
               id: d.data.id,
               name: d.data.name || "",
               fname: d.data.fname || "",
               parentName: d.parent && d.parent.data ? d.parent.data.name || "" : "",
               gender: d.data.gender || null,
               focusId: d.data.id,
               type: "person",
            });
         }
         // Add spouses
         if (d.data && d.data.spouse) {
            const spouses = Array.isArray(d.data.spouse) ? d.data.spouse : [d.data.spouse];
            spouses.forEach((s) => {
               peopleList.push({
                  id: s.id || `${d.data.id}-spouse`,
                  name: s.name || "",
                  fname: s.fname || "",
                  parentName: d.data.name || "",
                  gender: s.gender || null,
                  focusId: d.data.id,
                  type: "spouse",
               });
            });
         }
      });

      // Calculate bounds
      const bounds = {
         minX: d3.min(root.descendants(), (d) => d.x),
         maxX: d3.max(root.descendants(), (d) => d.x),
         minY: 0,
         maxY: d3.max(root.descendants(), (d) => d.y),
      };

      // Center both horizontally and vertically
      const offsetX = width / 2 - (bounds.maxX + bounds.minX) / 2;
      const offsetY = Math.max(60, (height - bounds.maxY) / 2);

      const g = svg
         .append("g")
         .attr("transform", `translate(${offsetX},${offsetY})`);

      // Zoom behavior
      const zoom = d3.zoom().on("zoom", (event) => {
         g.attr("transform", event.transform);
      });

      svg.call(zoom);

      // Default focus
      const defaultId = QASBA_CONFIG.defaultFocusId;
      const targetNode = root.descendants().find((d) => d.data && d.data.id === defaultId);
      if (targetNode) {
         const s = 1;
         const tx = width / 2 - targetNode.x * s;
         const ty = height / 2 - targetNode.y * s;
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
      }

      // Draw links
      g.selectAll(".link")
         .data(root.links())
         .enter()
         .append("path")
         .attr("class", "link")
         .attr(
            "d",
            d3
               .linkVertical()
               .x((d) => d.x)
               .y((d) => d.y)
         );

      // Draw nodes
      const nodes = g
         .selectAll(".node")
         .data(root.descendants())
         .enter()
         .append("g")
         .attr("class", "node")
         .attr("transform", (d) => `translate(${d.x},${d.y})`)
         .style("cursor", "pointer");

      // Node background circle - gender based color
      nodes
         .append("circle")
         .attr("r", 42)
         .attr("class", (d) => `node-bg ${d.data.gender || "unknown"}`);

      // Person icon
      nodes
         .append("foreignObject")
         .attr("x", -20)
         .attr("y", -20)
         .attr("width", 40)
         .attr("height", 40)
         .append("xhtml:div")
         .style("display", "flex")
         .style("align-items", "center")
         .style("justify-content", "center")
         .style("width", "100%")
         .style("height", "100%")
         .html(`<i class="fas fa-user" style="color: white; font-size: 40px;"></i>`);

      // Alive indicator badge
      nodes
         .append("circle")
         .attr("class", (d) => `alive-badge ${d.data.alive ? "alive" : "deceased"}`)
         .attr("r", 8)
         .attr("cx", 32)
         .attr("cy", 32);

      // Cross-family link indicator
      nodes
         .filter((d) => d.data.link === true)
         .append("text")
         .attr("class", "see-children-link")
         .attr("text-anchor", "middle")
         .attr("y", (d) => {
            const words = (d.data.name || "").split(/\s+/).filter(Boolean);
            let lines = 1;
            if (words.length > 2) {
               lines = 2;
            }
            return 58 + lines * 16 + 20;
         })
         .style("font-size", "11px")
         .style("fill", "#2196F3")
         .style("cursor", "pointer")
         .style("font-weight", "500")
         .text("👁 See children")
         .on("click", function (event, d) {
            event.stopPropagation();
            if (d.data.link && d.data.qasba && setSection) {
               setSection(d.data.qasba);
               setTimeout(() => {
                  window.focusPersonById = d.data.personId;
               }, 300);
            }
         });

      // Node name
      nodes
         .append("text")
         .attr("class", "node-label")
         .attr("text-anchor", "middle")
         .attr("y", 58)
         .style("font-size", "13px")
         .style("font-weight", "600")
         .each(function (d) {
            const text = d.data.name || "";
            const words = text.split(/\s+/).filter(Boolean);
            let lines = [];

            if (words.length <= 2) {
               lines = [words.join(" ")];
            } else {
               const mid = Math.ceil(words.length / 2);
               lines = [
                  words.slice(0, mid).join(" "),
                  words.slice(mid).join(" ")
               ].filter(l => l);
            }

            const t = d3.select(this);
            t.selectAll("tspan").data(lines).enter().append("tspan").attr("x", 0).attr("dy", (l, i) => (i === 0 ? "0em" : "1.2em")).text((l) => l);
         });

      // Node years
      nodes
         .append("text")
         .attr("class", "node-years")
         .attr("text-anchor", "middle")
         .attr("y", (d) => {
            const words = (d.data.name || "").split(/\s+/).filter(Boolean);
            let lines = 1;
            if (words.length > 2) {
               lines = 2;
            }
            return 58 + lines * 16;
         })
         .text((d) => {
            const dob = d.data.dob || "?";
            const dod = d.data.dod || "?";
            return d.data.alive ? `b. ${dob}` : `${dob} - ${dod}`;
         })
         .style("font-size", "11px");

      // Click handler
      nodes.on("click", (event, d) => {
         event.stopPropagation();
         const rect = svgElement.getBoundingClientRect();
         let x = event.pageX - rect.left;
         let y = event.pageY - rect.top;

         const popupWidth = 420;
         const popupHeight = 400;

         if (x + popupWidth > window.innerWidth) {
            x = window.innerWidth - popupWidth - 20;
         }
         if (y + popupHeight > window.innerHeight) {
            y = window.innerHeight - popupHeight - 20;
         }

         onNodeClick(d.data, { x, y });
      });

      // Reset zoom on double-click
      svg.on("dblclick", () => {
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      });

      // Store zoom ref and root for external access
      svgElement.__zoom = zoom;
      svgElement.__root = root;

      return { peopleList, root, zoom, svg: svgElement };
   } catch (error) {
      console.error("Error drawing tree:", error);
      return { peopleList: [] };
   }
};

/**
 * Focus on a specific node by ID and zoom to center it
 */
export const focusNodeById = (svgElement, nodeId) => {
   if (!svgElement || !svgElement.__root) return;

   const svg = d3.select(svgElement);
   const root = svgElement.__root;
   const zoom = svgElement.__zoom;

   const node = root.descendants().find((d) => d.data && d.data.id === nodeId);
   if (!node) return;

   const width = window.innerWidth - 280;
   const height = window.innerHeight - 140;
   const s = 1;
   const tx = width / 2 - node.x * s;
   const ty = height / 2 - node.y * s;

   svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
};

/**
 * Filter people list by search query
 */
export const filterPeople = (peopleList, query) => {
   if (!query || query.trim().length === 0) {
      return [];
   }
   const ql = query.toLowerCase();
   return peopleList.filter((p) =>
      (p.name || "").toLowerCase().includes(ql) ||
      (p.fname || "").toLowerCase().includes(ql)
   ).slice(0, 10);
};
