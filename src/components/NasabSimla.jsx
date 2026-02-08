import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import simlaData from "../data/simla.json";
import "../styles/tree.css";

export default function NasabSimla() {
   const svgRef = useRef();

   useEffect(() => {
      if (!svgRef.current) return;
      drawTree();
   }, []);

   const drawTree = () => {
      const width = window.innerWidth - 280;
      const height = window.innerHeight - 140;

      const svg = d3.select(svgRef.current);

      svg.attr("width", width).attr("height", height);

      // Clear previous content
      svg.selectAll("*").remove();

      // Create main group with zoom
      const g = svg.append("g").attr("transform", "translate(60,60)");

      // Zoom behavior
      const zoom = d3.zoom().on("zoom", (event) => {
         g.attr("transform", event.transform);
      });

      svg.call(zoom);

      // Create hierarchy from data
      const root = d3.hierarchy(simlaData);

      // Create tree layout
      const treeLayout = d3.tree().nodeSize([200, 150]);
      treeLayout(root);

      // If a default id is requested, find it and center it via zoom transform
      const defaultId = 'p70';
      const targetNode = root.descendants().find((d) => d.data && d.data.id === defaultId);
      if (targetNode) {
         // compute translation to place node at center of the SVG
         const s = 1; // initial scale
         const tx = width / 2 - targetNode.x * s;
         const ty = height / 2 - targetNode.y * s;
         // apply initial transform (overwrites the temporary translate(60,60))
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
      }

      // Draw links (parent-child connections)
      const links = g
         .selectAll(".link")
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
         .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Node background circle
      nodes
         .append("circle")
         .attr("r", 32)
         .attr("class", (d) => `node-bg ${d.data.gender || "unknown"}`);

      // Gender icon
      nodes.each(function (d) {
         const node = d3.select(this);

         if (d.data.gender === "male") {
            // Male icon (♂)
            node
               .append("text")
               .attr("class", "gender-icon")
               .attr("text-anchor", "middle")
               .attr("y", -5)
               .attr("font-size", "24px")
               .text("♂");
         } else if (d.data.gender === "female") {
            // Female icon (♀)
            node
               .append("text")
               .attr("class", "gender-icon")
               .attr("text-anchor", "middle")
               .attr("y", -5)
               .attr("font-size", "24px")
               .text("♀");
         }
      });

      // Alive indicator (small dot)
      nodes
         .append("circle")
         .attr("class", (d) => `alive-indicator ${d.data.alive ? "alive" : "deceased"}`)
         .attr("r", 6)
         .attr("cx", 20)
         .attr("cy", -20);

      // Node text (name)
      nodes
         .append("text")
         .attr("class", "node-label")
         .attr("text-anchor", "middle")
         .attr("y", 50)
         .attr("dy", "0.31em")
         .text((d) => d.data.name)
         .style("font-size", "12px")
         .style("font-weight", "500");

      // Year info (dob - dod or dob if alive)
      nodes
         .append("text")
         .attr("class", "node-years")
         .attr("text-anchor", "middle")
         .attr("y", 68)
         .attr("dy", "0.31em")
         .text((d) => {
            const dob = d.data.dob || "?";
            const dod = d.data.dod || "?";
            return d.data.alive ? `b. ${dob}` : `${dob} - ${dod}`;
         })
         .style("font-size", "11px")
         .style("fill", "#666");

      // Add tooltip on hover
      nodes
         .append("title")
         .text((d) => {
            let tooltip = `${d.data.name}\n`;
            if (d.data.dob) tooltip += `Born: ${d.data.dob}\n`;
            if (d.data.dod) tooltip += `Died: ${d.data.dod}\n`;
            if (d.data.place) tooltip += `Place: ${d.data.place}\n`;
            if (d.data.about) tooltip += `\n${d.data.about}`;
            return tooltip;
         });

      // Reset zoom on double-click
      svg.on("dblclick", () => {
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(60, 60));
      });
   };

   return (
      <div className="tree-container">
         <svg ref={svgRef} className="family-tree-svg"></svg>
         <div className="tree-legend">
            <div className="legend-item">
               <span className="legend-icon male"></span>
               <span>Male</span>
            </div>
            <div className="legend-item">
               <span className="legend-icon female"></span>
               <span>Female</span>
            </div>
            <div className="legend-item">
               <span className="legend-icon alive"></span>
               <span>Alive</span>
            </div>
            <div className="legend-item">
               <span className="legend-icon deceased"></span>
               <span>Deceased</span>
            </div>
         </div>
      </div>
   );
}
