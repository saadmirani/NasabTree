import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as d3 from "d3";
import simlaData from "../data/simla.json";
import "../styles/tree.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Mapping of religious abbreviations to Urdu translations
const abbreviationMap = {
   "R.A": "رضی اللہ تعالیٰ عنہ",
   "R.H": "رحمۃ اللہ علیہ",
   "R.Z": "رضی اللہ عنہا",
   "R.U.A": "رضی اللہ عنہ",
   "P.B.U.H": "صلی اللہ علیہ وسلم",
   "PBUH": "صلی اللہ علیہ وسلم",
   "R.D": "رضی اللہ دعنہ",
};

// Helper function to translate text to Urdu using Google Translate API
const translateToUrdu = async (text) => {
   if (!text || text.trim() === "") return "";
   try {
      // Extract religious abbreviations to translate them
      const abbreviationRegex = /\b(R\.A|R\.H|R\.Z|R\.D|P\.B\.U\.H|PBUH|R\.U\.A|CE|A\.D|B\.C)\b/gi;

      let textToTranslate = text;
      const abbreviationMatches = text.match(abbreviationRegex) || [];
      const abbreviationMap_lower = {};

      // Create case-insensitive map and store abbreviations
      Object.keys(abbreviationMap).forEach(key => {
         abbreviationMap_lower[key.toUpperCase()] = abbreviationMap[key];
      });

      // Replace abbreviations with placeholders
      abbreviationMatches.forEach((abbr, idx) => {
         textToTranslate = textToTranslate.replace(abbr, `[ABBR${idx}]`);
      });

      const response = await fetch(
         `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|ur`
      );
      const data = await response.json();

      let translatedText = text;
      if (data.responseStatus === 200 && data.responseData.translatedText) {
         translatedText = data.responseData.translatedText;

         // Restore abbreviations with their Urdu translations
         abbreviationMatches.forEach((abbr, idx) => {
            const urduAbbr = abbreviationMap_lower[abbr.toUpperCase()] || abbr;
            translatedText = translatedText.replace(`[ABBR${idx}]`, urduAbbr);
         });
      }

      return translatedText;
   } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text on error
   }
};

export default function NasabSimla({ setSection }) {
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

      // Focus on person after navigation from another family
      setTimeout(() => {
         if (window.focusPersonById) {
            const personId = window.focusPersonById;
            delete window.focusPersonById;
            focusNodeById(personId);
         }
      }, 500);
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
      try {
         const width = window.innerWidth - 280;
         const height = window.innerHeight - 140;

         const svg = d3.select(svgRef.current);
         svg.attr("width", width).attr("height", height);
         svg.selectAll("*").remove();

         console.log("Drawing tree for Simla data");

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
         const defaultId = 'p75';
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

         // Person icon - FontAwesome user icon
         nodes
            .append("foreignObject")
            .attr("x", -15)
            .attr("y", -15)
            .attr("width", 30)
            .attr("height", 30)
            .append("xhtml:div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("width", "100%")
            .style("height", "100%")
            .html(`<i class="fas fa-user" style="color: white; font-size: 32px;"></i>`);

         // Alive indicator - diamond/badge style positioned at bottom-right
         nodes
            .append("circle")
            .attr("class", (d) => `alive-badge ${d.data.alive ? "alive" : "deceased"}`)
            .attr("r", 8)
            .attr("cx", 32)
            .attr("cy", 32);

         // Link indicator - shows when descendants exist in another family (removed green bubble)
         // Now shows as blue "See children" text below the years
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
               return 58 + lines * 16 + 20; // below years with some spacing
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

         // Node years (position below wrapped name - only 2 lines if name is long)
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
               return 58 + lines * 16; // base y + line height
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
      } catch (error) {
         console.error("Error drawing Simla tree:", error);
      }
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
                                 <strong>{s.name}</strong>
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
               rootRef={rootRef}
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
const DetailPopup = memo(function DetailPopup({ data, position, onClose, rootRef }) {
   const generateAndDownloadShajra = useCallback(async () => {
      if (!rootRef.current || !data.id) return;

      const findNodeById = (node, id) => {
         if (node.data.id === id) return node;
         if (node.children) {
            for (let child of node.children) {
               const found = findNodeById(child, id);
               if (found) return found;
            }
         }
         return null;
      };

      const node = findNodeById(rootRef.current, data.id);
      if (!node) return;

      const chain = [];
      let current = node;
      while (current) {
         chain.unshift(current.data);
         current = current.parent;
      }

      const personUrduName = await translateToUrdu(data.name);
      const urduNames = await Promise.all(
         chain.map(person => translateToUrdu(person.name))
      );

      const htmlContent = `
         <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
            <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #1e3c72; font-size: 24px; margin: 0; font-weight: bold;">شجرہ نسب</h1>
               <h2 style="color: #2a5298; font-size: 18px; margin: 10px 0; font-weight: 600;">${personUrduName}</h2>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
               <h3 style="color: #1e3c72; margin-top: 0; font-size: 16px;">سلسلہ نسب (اردو)</h3>
               ${urduNames.map((name, idx) => `
                  <div style="margin: 8px 0; font-size: 14px; line-height: 1.6;">
                     <span style="color: #2196F3; font-weight: bold;">${idx + 1}.</span>
                     <span style="margin-right: 8px;">${name}</span>
                  </div>
               `).join('')}
            </div>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50;">
               <h3 style="color: #1e3c72; margin-top: 0; font-size: 16px;">Genealogy (English)</h3>
               ${chain.map((person, idx) => `
                  <div style="margin: 8px 0; font-size: 14px; line-height: 1.6;">
                     <span style="color: #4CAF50; font-weight: bold;">${idx + 1}.</span>
                     <span style="margin-left: 8px;">${person.name}</span>
                  </div>
               `).join('')}
            </div>
         </div>
      `;

      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.height = 'auto';
      document.body.appendChild(container);

      try {
         const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            allowTaint: true
         });

         const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
         });

         const pageWidth = pdf.internal.pageSize.getWidth();
         const pageHeight = pdf.internal.pageSize.getHeight();
         const imgData = canvas.toDataURL('image/png');
         const imgHeight = (canvas.height * pageWidth) / canvas.width;
         let currentHeight = 0;

         while (currentHeight < imgHeight) {
            if (currentHeight > 0) {
               pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, -currentHeight, pageWidth, imgHeight);
            currentHeight += pageHeight;
         }

         pdf.save(`Shajra_${data.name.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
         console.error('Error generating PDF:', error);
         alert('Error generating PDF. Please try again.');
      } finally {
         document.body.removeChild(container);
      }
   }, [data, rootRef]);

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

            {/* Shajra Download Section */}
            <div className="popup-divider"></div>
            <div className="popup-section">
               <button className="shajra-download-btn" onClick={generateAndDownloadShajra}>
                  📥 Generate Shajra (This Person)
               </button>
            </div>
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

