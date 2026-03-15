import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "../styles/personpage.css";
import {
   findPersonById,
   buildAncestryChain,
   findParent,
   findSiblings,
   getAllDescendants,
   getGenerationLevel,
   formatDate,
   getPersonStatus,
} from "../utils/genealogyUtils";

/**
 * PersonPage Component
 * Displays detailed information about a single person with SEO metadata
 * Accessible via URL like: /?person=p012&qasba=miranbigha
 */
export default function PersonPage({ personId, qasba, data, onClose, onNavigateToPerson }) {
   const [person, setPerson] = useState(null);
   const [parent, setParent] = useState(null);
   const [siblings, setSiblings] = useState([]);
   const [descendants, setDescendants] = useState([]);
   const [ancestry, setAncestry] = useState([]);

   useEffect(() => {
      if (!personId || !data) return;

      const foundPerson = findPersonById(data, personId);
      if (foundPerson) {
         setPerson(foundPerson);
         setAncestry(buildAncestryChain(data, personId));
         setParent(findParent(data, personId));
         setSiblings(findSiblings(data, personId));
         setDescendants(getAllDescendants(foundPerson).slice(0, 20)); // Limit to first 20 for performance
      }
   }, [personId, data]);

   if (!person) {
      return (
         <div className="personpage-container">
            <div className="personpage-loading">Person not found</div>
         </div>
      );
   }

   const generationLevel = getGenerationLevel(data, personId);
   const genderClass = person.gender === "male" ? "male" : "female";
   const statusClass = person.alive ? "living" : "deceased";

   // Calculate age if person is living and has DOB
   const getAge = () => {
      if (!person.alive || person.dob === "Not Known") return null;
      const dobYear = parseInt(person.dob);
      if (isNaN(dobYear)) return null;
      return new Date().getFullYear() - dobYear;
   };

   const age = getAge();

   return (
      <>
         <Helmet>
            <title>{person.name} - Genealogy, Bazm-e-Saadaat</title>
            <meta
               name="description"
               content={`${person.name} - ${generationLevel > 2 ? "Descendant" : "Ancestor"} in ${qasba || "Bazm-e-Saadaat"} genealogy. ${formatDate(person.dob)} - ${formatDate(person.dod)}`}
            />
            <meta name="keywords" content={`${person.name}, genealogy, family tree, ${qasba}, Saadaat`} />

            {/* Open Graph for Social Sharing */}
            <meta property="og:title" content={`${person.name} - Genealogy`} />
            <meta
               property="og:description"
               content={`Genealogical record of ${person.name} from Bazm-e-Saadaat archives`}
            />
            <meta property="og:type" content="profile" />

            {/* Schema.org Structured Data for Person */}
            <script type="application/ld+json">
               {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  "name": person.name,
                  "gender": person.gender,
                  "birthDate": person.dob !== "Not Known" ? person.dob : undefined,
                  "deathDate": person.dod !== "Not Known" && !person.alive ? person.dod : undefined,
                  "birthPlace": person.place !== "Not Known" ? { "@type": "Place", "name": person.place } : undefined,
                  "description": person.about || "",
                  "url": `https://bazmesaadaat.org/?person=${personId}&qasba=${qasba}`,
               })}
            </script>

            {/* Schema.org for Genealogy Relationship */}
            {parent && (
               <script type="application/ld+json">
                  {JSON.stringify({
                     "@context": "https://schema.org",
                     "@type": "FamilyRelationship",
                     "member": { "@type": "Person", "name": person.name },
                     "parent": { "@type": "Person", "name": parent.name },
                  })}
               </script>
            )}
         </Helmet>

         <div className="personpage-container">
            <button className="personpage-close" onClick={onClose}>
               ✕
            </button>

            {/* Header with Name and Basic Info */}
            <div className={`personpage-header ${genderClass} ${statusClass}`}>
               <h1 className="personpage-name">{person.name}</h1>
               <div className="personpage-status">
                  <span className="status-badge">{getPersonStatus(person)}</span>
                  {person.gender && <span className="gender-badge">{person.gender}</span>}
                  {age && <span className="age-badge">{age} years old</span>}
               </div>
            </div>

            {/* Main Content */}
            <div className="personpage-content">
               {/* Breadcrumb Ancestry */}
               {ancestry.length > 0 && (
                  <div className="personpage-breadcrumb">
                     <h3>Ancestry Line</h3>
                     <div className="ancestry-chain">
                        {ancestry.map((ancestor, index) => (
                           <div key={ancestor.id} className="ancestry-item">
                              <button
                                 className={`ancestry-link ${ancestor.id === personId ? "current" : ""}`}
                                 onClick={() => onNavigateToPerson && onNavigateToPerson(ancestor.id)}
                              >
                                 {ancestor.name}
                                 {ancestor.alive === false && <span className="deceased-marker">†</span>}
                              </button>
                              {index < ancestry.length - 1 && <span className="ancestry-arrow">↓</span>}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Personal Information */}
               <section className="personpage-section">
                  <h2>Personal Information</h2>
                  <dl className="personpage-info-list">
                     <dt>Full Name</dt>
                     <dd>{person.name}</dd>

                     {person.dob && person.dob !== "Not Known" && (
                        <>
                           <dt>Date of Birth</dt>
                           <dd>{formatDate(person.dob)}</dd>
                        </>
                     )}

                     {person.dod && person.dod !== "Not Known" && (
                        <>
                           <dt>Date of Death</dt>
                           <dd>{formatDate(person.dod)}</dd>
                        </>
                     )}

                     {person.place && person.place !== "Not Known" && (
                        <>
                           <dt>Place</dt>
                           <dd>{person.place}</dd>
                        </>
                     )}
                  </dl>
               </section>

               {/* About */}
               {person.about && person.about !== "Not Known" && (
                  <section className="personpage-section">
                     <h2>Biography</h2>
                     <p className="personpage-about">{person.about}</p>
                  </section>
               )}

               {/* Burial Information */}
               {person.burial && (
                  <section className="personpage-section">
                     <h2>Burial Location</h2>
                     <p className="personpage-burial">
                        <strong>Place:</strong> {person.burial.place || "Not Known"}
                     </p>
                     {person.burial.map && (
                        <p>
                           <a href={person.burial.map} target="_blank" rel="noopener noreferrer">
                              View on Map →
                           </a>
                        </p>
                     )}
                  </section>
               )}

               {/* Spouse Information */}
               {person.spouse && (
                  <section className="personpage-section">
                     <h2>Spouse</h2>
                     <div className="personpage-spouse-card">
                        <p className="spouse-name">{person.spouse.name}</p>
                        {person.spouse.about && person.spouse.about !== "Not Known" && (
                           <p className="spouse-about">{person.spouse.about}</p>
                        )}
                     </div>
                  </section>
               )}

               {/* Siblings */}
               {siblings.length > 0 && (
                  <section className="personpage-section">
                     <h2>Siblings ({siblings.length})</h2>
                     <div className="personpage-relations-list">
                        {siblings.map((sibling) => (
                           <button
                              key={sibling.id}
                              className="relation-card"
                              onClick={() => onNavigateToPerson && onNavigateToPerson(sibling.id)}
                           >
                              <span className="relation-name">{sibling.name}</span>
                              {sibling.alive === false && <span className="deceased-marker">†</span>}
                           </button>
                        ))}
                     </div>
                  </section>
               )}

               {/* Children/Descendants */}
               {person.children && person.children.length > 0 && (
                  <section className="personpage-section">
                     <h2>Children ({person.children.length})</h2>
                     <div className="personpage-relations-list">
                        {person.children.map((child) => (
                           <button
                              key={child.id}
                              className="relation-card"
                              onClick={() => onNavigateToPerson && onNavigateToPerson(child.id)}
                           >
                              <span className="relation-name">{child.name}</span>
                              {child.alive === false && <span className="deceased-marker">†</span>}
                           </button>
                        ))}
                     </div>
                  </section>
               )}

               {/* All Descendants Preview */}
               {descendants.length > 0 && (
                  <section className="personpage-section">
                     <h2>Descendants (showing first {Math.min(20, descendants.length)})</h2>
                     <p className="personpage-section-info">
                        Total descendants in record: {descendants.length}
                     </p>
                  </section>
               )}
            </div>

            {/* JSON-LD Breadcrumb */}
            <script type="application/ld+json">
               {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": ancestry.map((ancestor, index) => ({
                     "@type": "ListItem",
                     "position": index + 1,
                     "name": ancestor.name,
                     "item": `https://bazmesaadaat.org/?person=${ancestor.id}&qasba=${qasba}`,
                  })),
               })}
            </script>
         </div>
      </>
   );
}
