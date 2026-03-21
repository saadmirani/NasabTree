import { useRef, useCallback } from "react";
import * as d3 from "d3";
import { getTreeStatistics } from "../utils/genealogyStats";

/**
 * Custom hook for rendering genealogy trees using D3.js
 * Manages all D3-specific state and rendering logic for ALL family trees
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.qasbaName - Name of the family/location
 * @param {string} config.defaultFocusId - ID of person to focus on load
 * @param {Object} config.jsonData - Hierarchical family data
 * @param {Function} handleNodeClick - Callback function when node is clicked
 * @param {Function} setSection - Callback to change section (for links)
 * 
 * @returns {Object} - { svgRef, drawTree, focusNodeById, rootRef, peopleRef, getStats }
 */
export function useTreeRendering(config, handleNodeClick, setSection) {
   const svgRef = useRef();
   const rootRef = useRef(null);
   const zoomRef = useRef(null);
   const peopleRef = useRef([]);
   const statsRef = useRef(null);

   // Main D3 tree rendering function - shared by all 50+ family trees
   const drawTree = useCallback(() => {
      try {
         const width = window.innerWidth - 280;
         const height = window.innerHeight - 140;

         const svg = d3.select(svgRef.current);
         svg.attr("width", width).attr("height", height);
         svg.selectAll("*").remove();

         const root = d3.hierarchy(config.jsonData);
         const treeLayout = d3.tree().nodeSize([240, 180]);
         treeLayout(root);

         // store root and flattened people for search (includes main people + spouses)
         rootRef.current = root;

         // Calculate statistics from the tree data
         statsRef.current = getTreeStatistics(config.jsonData);
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
         peopleRef.current = peopleList;

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

         zoomRef.current = zoom;
         svg.call(zoom);

         // Default focus id — change this to center a different node on load
         const defaultId = config.defaultFocusId;
         const targetNode = root.descendants().find((d) => d.data && d.data.id === defaultId);
         if (targetNode) {
            const s = 1; // initial scale
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

         // Person icon - FontAwesome user icon
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

         // Alive indicator - diamond/badge style positioned at bottom-right
         nodes
            .append("circle")
            .attr("class", (d) => `alive-badge ${d.data.alive ? "alive" : "deceased"}`)
            .attr("r", 8)
            .attr("cx", 32)
            .attr("cy", 32);

         // Generation number tag - positioned at top-right edge of profile circle
         nodes
            .append("circle")
            .attr("class", "generation-badge")
            .attr("r", 12)
            .attr("cx", 30)
            .attr("cy", -30)
            .style("fill", "#FF6B35")
            .style("stroke", "#fff")
            .style("stroke-width", "2px")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)");

         nodes
            .append("text")
            .attr("class", "generation-label")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("x", 30)
            .attr("y", -30)
            .text((d) => d.depth + 1)
            .style("font-size", "11px")
            .style("font-weight", "700")
            .style("fill", "#fff")
            .style("pointer-events", "none");

         // Link indicator - shows when descendants exist in another family
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

         // Node name (full name split into maximum 2 lines, only if needed)
         nodes
            .append("text")
            .attr("class", "node-label")
            .attr("text-anchor", "middle")
            .attr("y", 58)
            .style("font-size", "13px")
            .style("font-weight", "600")
            .style("fill", (d) => d.data.isLawald ? "#dc2626" : "#1f2937")
            .each(function (d) {
               const text = d.data.name || "";
               const words = text.split(/\s+/).filter(Boolean);
               let lines = [];

               // Only split into 2 lines if more than 2 words
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

         // Node years (position below wrapped name)
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
            event.preventDefault();
            const rect = svgRef.current.getBoundingClientRect();
            const popupX = event.clientX - rect.left + 20;
            const popupY = event.clientY - rect.top + 20;
            handleNodeClick(d, popupX, popupY);
         });

         // Reset zoom on double-click
         svg.on("dblclick", () => {
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
         });
      } catch (error) {
         console.error("Error drawing tree:", error);
      }
   }, [config, handleNodeClick, setSection]);

   // Focus on a specific person and animate to them
   const focusNodeById = useCallback((personId) => {
      if (!rootRef.current || !svgRef.current || !zoomRef.current) return;

      const targetNode = rootRef.current.descendants().find((d) => d.data && d.data.id === personId);
      if (!targetNode) return;

      const width = window.innerWidth - 280;
      const height = window.innerHeight - 140;
      const s = 1;
      const tx = width / 2 - targetNode.x * s;
      const ty = height / 2 - targetNode.y * s;

      d3.select(svgRef.current)
         .transition()
         .duration(750)
         .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
   }, []);

   // Get the computed statistics for the current tree
   const getStats = useCallback(() => {
      return statsRef.current;
   }, []);

   return {
      svgRef,
      drawTree,
      focusNodeById,
      rootRef,
      peopleRef,
      getStats,
   };
}
