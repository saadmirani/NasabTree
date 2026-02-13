import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as d3 from "d3";
import simlaData from "../data/simla.json";
import "../styles/tree.css";

export default function NasabSimla() {
   const svgRef = useRef();
   const peopleRef = useRef([]);
   const rootRef = useRef(null);
   const zoomRef = useRef(null);
   const [selectedNode, setSelectedNode] = useState(null);
   const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
   const [query, setQuery] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   useEffect(() => {
      if (!svgRef.current) return;
      drawTree();
   }, []);

   const handleNodeClick = useCallback((d, event) => {
      event.stopPropagation();
      const rect = svgRef.current.getBoundingClientRect();
      let x = event.pageX - rect.left;
      let y = event.pageY - rect.top;

      // Adjust position to prevent overlapping with screen edges
      const popupWidth = 420;
      const popupHeight = 400; // approximate

      if (x + popupWidth > window.innerWidth) {
         x = window.innerWidth - popupWidth - 20;
      }
      if (y + popupHeight > window.innerHeight) {
         y = window.innerHeight - popupHeight - 20;
      }

      setPopupPos({ x, y });
      setSelectedNode(d.data);
   }, []);

   // Focus a node by id (re-uses tree layout stored in rootRef)
   const focusNodeById = useCallback((id) => {
      const svg = d3.select(svgRef.current);
      const root = rootRef.current;
      if (!root) return;
      const node = root.descendants().find((d) => d.data && d.data.id === id);
      if (!node) return;
      const width = window.innerWidth - 280;
      const height = window.innerHeight - 140;
      const s = 1;
      const tx = width / 2 - node.x * s;
      const ty = height / 2 - node.y * s;
      const zoom = zoomRef.current || d3.zoom();
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
   }, []);

   const shortName = (full) => {
      if (!full) return "";
      const parts = full.split(/\s+/).filter(Boolean);
      return parts.slice(0, 2).join(" ");
   };

   const onQueryChange = useCallback((q) => {
      setQuery(q);
      if (!q || q.trim().length === 0) {
         setSuggestions([]);
         return;
      }
      const ql = q.toLowerCase();
      const matches = peopleRef.current.filter((p) => (p.name || "").toLowerCase().includes(ql) || (p.fname || "").toLowerCase().includes(ql));
      setSuggestions(matches.slice(0, 10));
   }, []);

   const onSelectSuggestion = useCallback((item) => {
      setQuery("");
      setSuggestions([]);
      if (item && item.focusId) focusNodeById(item.focusId);
   }, [focusNodeById]);

   const drawTree = useCallback(() => {
      const width = window.innerWidth - 280;
      const height = window.innerHeight - 140;

      const svg = d3.select(svgRef.current);
      svg.attr("width", width).attr("height", height);
      svg.selectAll("*").remove();

      // Calculate tree dimensions
      const root = d3.hierarchy(simlaData);
      const treeLayout = d3.tree().nodeSize([240, 180]);
      treeLayout(root);

      // store root and flattened people for search (includes main people + spouses)
      rootRef.current = root;
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
      const defaultId = 'p70';
      const targetNode = root.descendants().find((d) => d.data && d.data.id === defaultId);
      if (targetNode) {
         const s = 1; // initial scale
         // When we set the zoom transform it REPLACES the group's translate(offsetX,offsetY).
         // So compute tx/ty relative to node's raw x/y (not adding offsetX/offsetY).
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

      // Person icon using Material Symbols
      nodes
         .append("text")
         .attr("class", "material-symbols-outlined")
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .attr("font-family", "'Material Symbols Outlined'")
         .text("person")
         .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

      // Alive indicator - diamond/badge style positioned at bottom-right
      nodes
         .append("circle")
         .attr("class", (d) => `alive-badge ${d.data.alive ? "alive" : "deceased"}`)
         .attr("r", 8)
         .attr("cx", 32)
         .attr("cy", 32);

      // Node name (wrap long names into multiple tspans)
      nodes
         .append("text")
         .attr("class", "node-label")
         .attr("text-anchor", "middle")
         .attr("y", 50)
         .style("font-size", "13px")
         .style("font-weight", "600")
         .each(function (d) {
            const text = d.data.name || "";
            const words = text.split(/\s+/).filter(Boolean);
            const maxPerLine = 2;
            const lines = [];
            for (let i = 0; i < words.length; i += maxPerLine) {
               lines.push(words.slice(i, i + maxPerLine).join(" "));
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
            const lines = Math.max(1, Math.ceil(words.length / 2));
            return 50 + lines * 16; // base y + line height
         })
         .text((d) => {
            const dob = d.data.dob || "?";
            const dod = d.data.dod || "?";
            return d.data.alive ? `b. ${dob}` : `${dob} - ${dod}`;
         })
         .style("font-size", "11px");

      // Click handler
      nodes.on("click", (event, d) => {
         handleNodeClick(d, event);
      });

      // Reset zoom on double-click
      svg.on("dblclick", () => {
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      });
   }, [handleNodeClick]);

   return (
      <div className="tree-container" onClick={() => setSelectedNode(null)}>
         <div className="search-container">
            <input
               className="tree-search"
               placeholder="Search name or father..."
               value={query}
               onChange={(e) => onQueryChange(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter" && suggestions.length > 0) {
                     onSelectSuggestion(suggestions[0]);
                  }
               }}
            />
            {suggestions.length > 0 && (
               <ul className="search-suggestions">
                  {suggestions.map((s) => {
                     // For spouses, show husband's name; for persons, show father's name
                     const displayName = s.type === "spouse"
                        ? (shortName(s.parentName) || s.parentName)
                        : (shortName(s.fname) || s.fname || s.parentName || "");
                     const prefix = s.type === "spouse" ? "W/O " : "";
                     return (
                        <li key={`${s.id}-${s.type}`} onClick={() => onSelectSuggestion(s)}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div>
                                 <strong>{shortName(s.name) || s.name}</strong>
                                 {displayName && <span className="suggest-fname"> — {prefix}{displayName}</span>}
                              </div>
                              <div style={{ color: '#9ca3af', fontSize: 12 }}>{s.focusId}</div>
                           </div>
                        </li>
                     );
                  })}
               </ul>
            )}
         </div>
         <svg ref={svgRef} className="family-tree-svg"></svg>

         {selectedNode && (
            <DetailPopup
               data={selectedNode}
               position={popupPos}
               onClose={() => setSelectedNode(null)}
            />
         )}

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

// Detail Popup Component
const DetailPopup = memo(function DetailPopup({ data, position, onClose }) {
   return (
      <div
         className="detail-popup"
         onClick={(e) => e.stopPropagation()}
      >
         <button className="popup-close" onClick={onClose}>×</button>
         <div className="popup-content">
            {/* Main person */}
            <div className="popup-section">
               <div className="person-header">
                  <span className="person-name">{data.name}</span>
                  <span className={`status-bubble ${data.alive ? "alive" : "deceased"}`}></span>
               </div>

               {data.dob && <p><strong>Born:</strong> {data.dob}</p>}
               {data.place && <p><strong>Birth place:</strong> {data.place}</p>}
               {data.about && <p><strong>About:</strong> <span className="text-wrap">{data.about}</span></p>}

               {data.burial && (
                  <p>
                     <strong>Burial:</strong> {data.burial.place}
                     {data.burial.map && (
                        <> | <a href={data.burial.map} target="_blank" rel="noopener noreferrer">View on map</a></>
                     )}
                  </p>
               )}
            </div>

            {/* Spouse(s) */}
            {data.spouse && (
               <>
                  <div className="popup-divider"></div>
                  {Array.isArray(data.spouse) ? (
                     data.spouse.map((spouse, idx) => (
                        <SpouseSection key={idx} spouse={spouse} personGender={data.gender} />
                     ))
                  ) : (
                     <SpouseSection spouse={data.spouse} personGender={data.gender} />
                  )}
               </>
            )}
         </div>
      </div>
   );
});

// Spouse Section Component
const SpouseSection = memo(function SpouseSection({ spouse, personGender }) {
   const relation = personGender === "male" ? "D/O" : "S/O";

   return (
      <div className="popup-section">
         <div className="person-header">
            <span className="person-name">Married to {spouse.name}</span>
            <span className={`status-badge ${spouse.alive ? "alive" : "deceased"}`}></span>
         </div>

         {spouse.fname && <p><strong>{relation}</strong> {spouse.fname}</p>}
         {spouse.dob && <p><strong>Born:</strong> {spouse.dob}</p>}
         {spouse.place && <p><strong>Birth place:</strong> {spouse.place}</p>}
         {spouse.about && <p><strong>About:</strong> <span className="text-wrap">{spouse.about}</span></p>}

         {spouse.burial && (
            <p>
               <strong>Burial:</strong> {spouse.burial.place}
               {spouse.burial.map && (
                  <> | <a href={spouse.burial.map} target="_blank" rel="noopener noreferrer">View on map</a></>
               )}
            </p>
         )}
      </div>
   );
});

