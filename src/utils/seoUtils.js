/**
 * SEO Utilities for genealogical data
 * Generates JSON-LD structured data and meta tags for search engines
 */

/**
 * Generate JSON-LD structured data for a person in the genealogy
 * @param {Object} person - Person object from json data
 * @param {string} qasbaName - Name of the Qasba/family location
 * @returns {Object} JSON-LD structured data
 */
export function generatePersonSchema(person, qasbaName) {
   if (!person || !person.name) return null;

   const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": person.name,
      "alternateName": person.fname || undefined,
      "birthDate": person.dob || undefined,
      "deathDate": person.dod || undefined,
      "birthPlace": person.place || undefined,
      "description": person.about || `Member of ${qasbaName} genealogical family tree`,
      "gender": person.gender === "male" ? "Male" : "Female",
      "url": typeof window !== "undefined" ? window.location.href : undefined,
   };

   // Remove undefined values
   Object.keys(schema).forEach(key => schema[key] === undefined && delete schema[key]);

   // Add spouse information if available
   if (person.spouse) {
      const spouses = Array.isArray(person.spouse) ? person.spouse : [person.spouse];
      schema.spouse = spouses.map(s => ({
         "@type": "Person",
         "name": s.name
      }));
   }

   // Add father/parent information if available
   if (person.fname) {
      schema.parent = {
         "@type": "Person",
         "name": person.fname,
         "relationship": "Father"
      };
   }

   return schema;
}

/**
 * Generate JSON-LD structured data for the entire genealogical tree
 * @param {Object} rootData - Root person data
 * @param {string} qasbaName - Name of the Qasba/family location
 * @returns {Object} JSON-LD structured data
 */
export function generateFamilyTreeSchema(rootData, qasbaName) {
   if (!rootData || !rootData.name) return null;

   const flattenPeople = (person, list = []) => {
      if (person) {
         list.push({
            "@type": "Person",
            "name": person.name,
            "birthDate": person.dob,
            "deathDate": person.dod,
            "gender": person.gender === "male" ? "Male" : "Female"
         });
      }
      if (person && person.children && Array.isArray(person.children)) {
         person.children.forEach(child => flattenPeople(child, list));
      }
      return list;
   };

   return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": qasbaName,
      "description": `Genealogical family tree for ${qasbaName}`,
      "member": flattenPeople(rootData)
   };
}

/**
 * Generate meta data for a person
 * @param {Object} person - Person object
 * @param {string} qasbaName - Name of the Qasba
 * @returns {Object} Meta data object
 */
export function generatePersonMetadata(person, qasbaName) {
   if (!person || !person.name) return null;

   const details = [];
   if (person.fname) details.push(`Father: ${person.fname}`);
   if (person.dob) details.push(`Born: ${person.dob}`);
   if (person.dod) details.push(`Died: ${person.dod}`);
   if (person.children && person.children.length > 0) {
      details.push(`${person.children.length} child${person.children.length !== 1 ? 'ren' : ''}`);
   }

   return {
      title: `${person.name} - ${qasbaName} Family Tree`,
      description: details.length > 0
         ? `${person.name} (${details.join(', ')}) - Genealogical records from ${qasbaName}`
         : `${person.name} - Member of ${qasbaName} genealogical family tree`,
      keywords: `${person.name}, genealogy, ${qasbaName}, family tree${person.fname ? `, ${person.fname}` : ''}`
   };
}

/**
 * Generate breadcrumb schema for navigation
 * @param {string} qasbaName - Name of the Qasba
 * @returns {Object} JSON-LD structured data
 */
export function generateBreadcrumbSchema(qasbaName) {
   return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
         {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": typeof window !== "undefined" ? `${window.location.origin}` : "/"
         },
         {
            "@type": "ListItem",
            "position": 2,
            "name": qasbaName,
            "item": typeof window !== "undefined" ? window.location.href : "/"
         }
      ]
   };
}
