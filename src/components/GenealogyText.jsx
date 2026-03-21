import React, { useState } from "react";
import "../styles/genealogytext.css";
import { getAllDescendants } from "../utils/genealogyUtils";

/**
 * GenealogyText Component
 * Displays genealogical tree in text/hierarchy format with connecting lines
 * Alternative to D3 visualization that is SEO-friendly and accessible
 */
export default function GenealogyText({ data, onPersonClick = null, qasbaName = "" }) {
   const [expandedIds, setExpandedIds] = useState({});

   const toggleExpanded = (id) => {
      setExpandedIds((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

   const renderSpouses = (spouse) => {
      if (!spouse) return null;

      if (Array.isArray(spouse)) {
         return (
            <div className="genealogy-spouses">
               {spouse.map((s, idx) => (
                  <div key={`${s.id || idx}`} className="spouse-item">
                     <span className="wife-number">{idx + 1}.</span>
                     <span className="wife-name">{s.name}</span>
                  </div>
               ))}
            </div>
         );
      }

      return (
         <div className="genealogy-spouses">
            <div className="spouse-item">
               <span className="wife-number">1.</span>
               <span className="wife-name">{spouse.name}</span>
            </div>
         </div>
      );
   };

   const renderPerson = (person, level = 0, isLast = true, path = "") => {
      const hasChildren = person.children && person.children.length > 0;
      const isExpanded = expandedIds[person.id];
      const newPath = path + (isLast ? "0" : "1");

      return (
         <div
            key={person.id}
            className={`genealogy-person-item level-${level}`}
            data-person-id={person.id}
         >
            {/* Tree connecting lines */}
            <div className="tree-lines">
               {level > 0 && (
                  <>
                     <div className={`vertical-line ${isLast ? "last" : ""}`}></div>
                     <div className="horizontal-line"></div>
                  </>
               )}
            </div>

            {/* Person Card */}
            <div className="person-card">
               {/* Header with expand button and name */}
               <div className="person-header">
                  <button
                     className={`expand-button ${hasChildren ? "visible" : "hidden"} ${isExpanded ? "expanded" : ""
                        }`}
                     onClick={() => toggleExpanded(person.id)}
                     title={hasChildren ? "Toggle children" : "No children"}
                  >
                     {hasChildren ? (isExpanded ? "−" : "+") : " "}
                  </button>

                  <button
                     className="person-name-button"
                     onClick={() => onPersonClick && onPersonClick(person.id)}
                     title={`View ${person.name}`}
                  >
                     <span className={`person-name ${person.isLawald ? "lawald" : ""}`}>
                        {person.name}
                        {person.isLawald && <span className="lawald-badge"> (Lawald)</span>}
                     </span>
                     {person.alive === false && <span className="deceased-badge">†</span>}
                  </button>

                  {(person.dob || person.dod) && (
                     <span className="person-dates">
                        {person.dob && person.dob !== "Not Known" && `b. ${person.dob}`}
                        {person.dod && person.dod !== "Not Known" && ` - d. ${person.dod}`}
                     </span>
                  )}
               </div>

               {/* Spouses - displayed below main person */}
               {person.spouse && renderSpouses(person.spouse)}
            </div>

            {/* Children - only render if expanded and has children */}
            {hasChildren && isExpanded && (
               <div className="children-group">
                  {person.children.map((child, idx) => (
                     <div key={child.id} className={`child-wrapper ${idx === person.children.length - 1 ? "last-child" : ""}`}>
                        {renderPerson(child, level + 1, idx === person.children.length - 1, newPath)}
                     </div>
                  ))}
               </div>
            )}

            {/* Collapsed info */}
            {hasChildren && !isExpanded && (
               <div className="collapsed-info">
                  ({person.children.length} child{person.children.length !== 1 ? "ren" : ""})
               </div>
            )}
         </div>
      );
   };

   if (!data) {
      return <div className="genealogy-text-empty">No genealogical data available</div>;
   }

   const rootData = Array.isArray(data) ? data : [data];

   return (
      <div className="genealogy-text-container">
         <div className="genealogy-text-header">
            <h2>Family Tree {qasbaName && `- ${qasbaName}`}</h2>
            <p className="genealogy-text-description">
               Click + to expand families or on a name to view details
            </p>
         </div>

         <div className="genealogy-tree-view">
            {rootData.map((root) => (
               <div key={root.id} className="genealogy-root-person">
                  {renderPerson(root, 0, true, "")}
               </div>
            ))}
         </div>

         {/* Hidden structured data for search engines */}
         <SchemaOrgStructuredData data={rootData} qasbaName={qasbaName} />
      </div>
   );
}

/**
 * Component to render Schema.org structured data for genealogical relationships
 * This makes the tree data available to search engines
 */
function SchemaOrgStructuredData({ data, qasbaName }) {
   const generatePersonSchema = (person, qasbaName) => {
      return {
         "@context": "https://schema.org",
         "@type": "Person",
         "name": person.name,
         "gender": person.gender === "male" ? "Male" : "Female",
         "birthDate": person.dob !== "Not Known" ? person.dob : undefined,
         "deathDate": person.dod !== "Not Known" && !person.alive ? person.dod : undefined,
         "birthPlace": person.place !== "Not Known" ? { "@type": "Place", "name": person.place } : undefined,
         "description": person.about || "",
         "url": `https://bazmesaadaat.org/?person=${person.id}&qasba=${qasbaName}`,
         "children": person.children ? person.children.map((child) => ({
            "@type": "Person",
            "name": child.name,
            "url": `https://bazmesaadaat.org/?person=${child.id}&qasba=${qasbaName}`,
         })) : undefined,
         "spouse": person.spouse ? {
            "@type": "Person",
            "name": person.spouse.name,
         } : undefined,
      };
   };

   return (
      <script type="application/ld+json" style={{ display: "none" }}>
         {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": data.map((person, index) => ({
               "@type": "ListItem",
               "position": index + 1,
               "name": person.name,
               "item": `https://bazmesaadaat.org/?person=${person.id}&qasba=${qasbaName}`,
            })),
         })}
      </script>
   );
}
