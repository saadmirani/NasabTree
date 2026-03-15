import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import deoraData from "../data/deora.json";
import "../styles/tree.css";
import GenealogyText from "./GenealogyText";
import { DetailPopup } from "./DetailPopup";
import { useTreeRendering } from "../hooks/useTreeRendering";
import { generateFamilyTreeSchema, generateBreadcrumbSchema } from "../utils/seoUtils";

// ==================== CONFIGURATION ====================
const QASBA_CONFIG = {
   qasbaName: "Qasba Deora",
   defaultFocusId: "p44",
   jsonData: deoraData
};
// =================================================

export default function NasabDeora({ setSection }) {
   const [selectedNode, setSelectedNode] = useState(null);
   const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
   const [query, setQuery] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [viewMode, setViewMode] = useState("tree");

   // Use the custom hook for all D3 rendering logic
   const handleNodeClick = useCallback((d, popupX, popupY) => {
      setSelectedNode(d.data);
      setPopupPos({ x: popupX, y: popupY });
   }, []);

   const { svgRef, drawTree, focusNodeById, rootRef, peopleRef } = useTreeRendering(
      QASBA_CONFIG,
      handleNodeClick,
      setSection
   );

   const handlePersonClick = useCallback((personId) => {
      if (personId) focusNodeById(personId);
   }, [focusNodeById]);

   // Draw tree when component mounts or viewMode changes
   React.useEffect(() => {
      if (viewMode === "tree") {
         setTimeout(() => drawTree(), 100);
      }
   }, [viewMode, drawTree]);

   React.useEffect(() => {
      drawTree();

      // Focus on person after navigation from another family
      setTimeout(() => {
         if (window.focusPersonById) {
            const personId = window.focusPersonById;
            delete window.focusPersonById;
            focusNodeById(personId);
         }
      }, 500);
   }, [drawTree, focusNodeById]);

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

   return (
      <div className="nasab-wrapper">
         <Helmet>
            <title>Qasba Deora - Genealogical Family Tree | Aal-e-Miran</title>
            <meta name="description" content="Interactive genealogical family tree for Qasba Deora. Search for ancestors, descendants, biographical information, dates, and family relationships." />
            <meta name="keywords" content="Qasba Deora, genealogy, family tree, ancestors, descendants, genealogical records" />
            <meta property="og:title" content="Qasba Deora - Family Tree" />
            <meta property="og:description" content="Explore the genealogical family tree of Qasba Deora with detailed biographical information." />
            <script type="application/ld+json">
               {JSON.stringify(generateFamilyTreeSchema(deoraData, QASBA_CONFIG.qasbaName))}
            </script>
            <script type="application/ld+json">
               {JSON.stringify(generateBreadcrumbSchema(QASBA_CONFIG.qasbaName))}
            </script>
         </Helmet>
         <div className="tree-container" onClick={() => setSelectedNode(null)}>
            {/* Tree View */}
            {viewMode === "tree" && (
               <>
                  <div className="search-bar-header">
                     {/* Search Bar */}
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

                     {/* View Mode Toggle Switch */}
                     <div className="view-mode-switch">
                        <button
                           className={viewMode === "tree" ? "active" : ""}
                           onClick={() => setViewMode("tree")}
                        >
                           Tree
                        </button>
                        <button
                           className={viewMode === "text" ? "active" : ""}
                           onClick={() => setViewMode("text")}
                        >
                           List
                        </button>
                     </div>
                  </div>

                  <svg ref={svgRef} className="family-tree-svg"></svg>

                  {selectedNode && (
                     <DetailPopup
                        data={selectedNode}
                        position={popupPos}
                        onClose={() => setSelectedNode(null)}
                        rootRef={rootRef}
                        setSection={setSection}
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
               </>
            )}

            {/* Text View - SEO Friendly */}
            {viewMode === "text" && (
               <>
                  <div className="search-bar-header">
                     {/* Search Bar */}
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

                     {/* View Mode Toggle Switch */}
                     <div className="view-mode-switch">
                        <button
                           className={viewMode === "tree" ? "active" : ""}
                           onClick={() => setViewMode("tree")}
                        >
                           Tree
                        </button>
                        <button
                           className={viewMode === "text" ? "active" : ""}
                           onClick={() => setViewMode("text")}
                        >
                           List
                        </button>
                     </div>
                  </div>

                  <div className="genealogy-text-scrollable">
                     <GenealogyText
                        data={QASBA_CONFIG.jsonData}
                        onPersonClick={handlePersonClick}
                        qasbaName={QASBA_CONFIG.qasbaName}
                     />
                  </div>
               </>
            )}
         </div>
      </div>
   );
}

