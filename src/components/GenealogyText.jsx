import React, { useState } from "react";
import "../styles/genealogytext.css";
import { getAllDescendants } from "../utils/genealogyUtils";

/**
 * GenealogyText Component
 * Displays genealogical tree in text/hierarchy format for search engines and readability
 * Alternative to D3 visualization that is SEO-friendly
 */
export default function GenealogyText({ data, onPersonClick = null, qasbaName = "" }) {
   const [expandedIds, setExpandedIds] = useState({});

   const toggleExpanded = (id) => {
      setExpandedIds((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

   const renderPerson = (person, level = 0) => {
      const hasChildren = person.children && person.children.length > 0;
      const isExpanded = expandedIds[person.id];
      const genderClass = person.gender === "male" ? "male" : "female";
      const statusClass = person.alive ? "living" : "deceased";

      return (
         <div
            key={person.id}
            className={`genealogy-person-item level-${level}`}
            data-person-id={person.id}
            data-gender={person.gender}
            data-status={person.alive ? "living" : "deceased"}
         >
            <div className={`genealogy-person-header ${genderClass} ${statusClass}`}>
               {hasChildren && (
                  <button
                     className={`expand-button ${isExpanded ? "expanded" : ""}`}
                     onClick={() => toggleExpanded(person.id)}
                     aria-label={`${isExpanded ? "Collapse" : "Expand"} ${person.name}`}
                  >
                     {isExpanded ? "▼" : "▶"}
                  </button>
               )}
               {!hasChildren && <span className="no-children-spacer"></span>}

               <button
                  className="genealogy-person-name"
                  onClick={() => onPersonClick && onPersonClick(person.id)}
                  title={`Click to view ${person.name}'s details`}
               >
                  <span className="person-name">{person.name}</span>
                  {person.alive === false && <span className="deceased-marker">†</span>}
                  {person.gender && (
                     <span className="gender-indicator" aria-label={`Gender: ${person.gender}`}>
                        {person.gender === "male" ? "♂" : "♀"}
                     </span>
                  )}
               </button>

               {(person.dob || person.dod) && (
                  <span className="person-dates">
                     {person.dob && person.dob !== "Not Known" && (
                        <span className="dob">{person.dob}</span>
                     )}
                     {person.dod && person.dod !== "Not Known" && (
                        <span className="dod">- {person.dod}</span>
                     )}
                  </span>
               )}
            </div>

            {/* Spouse Information */}
            {person.spouse && (
               <div className="genealogy-spouse-info">
                  <span className="spouse-label">Spouse:</span>
                  <span className="spouse-name">{person.spouse.name}</span>
               </div>
            )}

            {/* Children */}
            {hasChildren && isExpanded && (
               <div className="genealogy-children-container">
                  {person.children.map((child) => renderPerson(child, level + 1))}
               </div>
            )}

            {/* Children Count Indicator */}
            {hasChildren && !isExpanded && (
               <div className="genealogy-collapsed-indicator">
                  {person.children.length} child{person.children.length !== 1 ? "ren" : ""} +{" "}
                  {getAllDescendants(person).length} descendants
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
            <h2>Genealogical Hierarchy {qasbaName && `- ${qasbaName}`}</h2>
            <p className="genealogy-text-description">
               Interactive family tree showing genealogical relationships. Click on a name to view details,
               or click the arrow to expand/collapse families.
            </p>
         </div>

         <div className="genealogy-tree">
            {rootData.map((root) => (
               <div key={root.id} className="genealogy-root">
                  {renderPerson(root, 0)}
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
