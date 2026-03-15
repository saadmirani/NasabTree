/**
 * Utility functions to work with genealogical data
 */

/**
 * Find a person by ID in the genealogical tree
 */
export const findPersonById = (data, personId) => {
   if (!Array.isArray(data)) data = [data];

   for (let person of data) {
      const found = findPersonByIdRecursive(person, personId);
      if (found) return found;
   }
   return null;
};

const findPersonByIdRecursive = (person, targetId) => {
   if (person.id === targetId) return person;

   if (person.children && Array.isArray(person.children)) {
      for (let child of person.children) {
         const found = findPersonByIdRecursive(child, targetId);
         if (found) return found;
      }
   }

   return null;
};

/**
 * Build genealogical ancestry chain (from current person to root)
 */
export const buildAncestryChain = (data, personId) => {
   if (!Array.isArray(data)) data = [data];

   for (let person of data) {
      const chain = findAncestryChain(person, personId, []);
      if (chain.length > 0) {
         return chain.reverse();
      }
   }
   return [];
};

const findAncestryChain = (person, targetId, chain) => {
   chain.push(person);

   if (person.id === targetId) {
      return chain;
   }

   if (person.children && Array.isArray(person.children)) {
      for (let child of person.children) {
         const result = findAncestryChain(child, targetId, [...chain]);
         if (result.length > 0 && result[result.length - 1].id === targetId) {
            return result;
         }
      }
   }

   return [];
};

/**
 * Get all descendants of a person
 */
export const getAllDescendants = (person) => {
   let descendants = [];

   if (person.children && Array.isArray(person.children)) {
      for (let child of person.children) {
         descendants.push(child);
         descendants = descendants.concat(getAllDescendants(child));
      }
   }

   return descendants;
};

/**
 * Find siblings of a person
 */
export const findSiblings = (data, personId) => {
   if (!Array.isArray(data)) data = [data];

   for (let person of data) {
      const siblings = findSiblingsRecursive(person, personId);
      if (siblings) return siblings;
   }
   return [];
};

const findSiblingsRecursive = (person, targetId) => {
   if (person.children && Array.isArray(person.children)) {
      const hasPerson = person.children.some(child => child.id === targetId);
      if (hasPerson) {
         return person.children.filter(child => child.id !== targetId);
      }

      for (let child of person.children) {
         const result = findSiblingsRecursive(child, targetId);
         if (result) return result;
      }
   }

   return null;
};

/**
 * Get parent of a person
 */
export const findParent = (data, personId) => {
   if (!Array.isArray(data)) data = [data];

   for (let person of data) {
      const parent = findParentRecursive(person, personId);
      if (parent) return parent;
   }
   return null;
};

const findParentRecursive = (person, targetId) => {
   if (person.children && Array.isArray(person.children)) {
      const hasPerson = person.children.some(child => child.id === targetId);
      if (hasPerson) return person;

      for (let child of person.children) {
         const result = findParentRecursive(child, targetId);
         if (result) return result;
      }
   }

   return null;
};

/**
 * Get person's generation level (distance from root)
 */
export const getGenerationLevel = (data, personId) => {
   const ancestry = buildAncestryChain(data, personId);
   return ancestry.length - 1;
};

/**
 * Format person's name for display
 */
export const formatPersonName = (person) => {
   return person.name || "Unknown";
};

/**
 * Get person's status (alive/deceased)
 */
export const getPersonStatus = (person) => {
   return person.alive ? "Living" : "Deceased";
};

/**
 * Format dates
 */
export const formatDate = (dateStr) => {
   if (!dateStr || dateStr === "Not Known") return "Unknown";
   return dateStr;
};
