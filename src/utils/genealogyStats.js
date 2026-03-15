/**
 * Genealogical Statistics Utility
 * Calculates generations, ages, and other statistics from family trees
 */

/**
 * Calculate depth (number of generations) in the tree
 * @param {Object} node - Root node of genealogy tree
 * @returns {number} - Total number of generations
 */
export function calculateGenerations(node) {
   if (!node) return 0;

   function getDepth(n) {
      if (!n.children || n.children.length === 0) {
         return 1;
      }
      return 1 + Math.max(...n.children.map(getDepth));
   }

   return getDepth(node);
}

/**
 * Calculate average age of people in the family tree
 * @param {Object} node - Root node of genealogy tree
 * @returns {Object} - { averageAge, totalPeople, livingPeople, deceasedPeople }
 */
export function calculateAverageAge(node) {
   if (!node) {
      return { averageAge: 0, totalPeople: 0, livingPeople: 0, deceasedPeople: 0 };
   }

   const people = [];

   function flattenTree(n) {
      if (n) {
         people.push(n);
         if (n.children && Array.isArray(n.children)) {
            n.children.forEach(child => flattenTree(child));
         }
      }
   }

   flattenTree(node);

   let totalAge = 0;
   let ageCount = 0;
   let livingCount = 0;
   let deceasedCount = 0;

   people.forEach(person => {
      if (person.alive) {
         livingCount++;
      } else {
         deceasedCount++;
      }

      // Calculate age if we have both birth and death dates
      if (person.dob && person.dod) {
         // Extract year from dates (format could be "1760 CE" or "1760-1761 CE" or "≈1760 CE")
         const dobYear = parseInt(person.dob.match(/\d{4}/)?.[0] || 0);
         const dodYear = parseInt(person.dod.match(/\d{4}/)?.[0] || 0);

         if (dobYear > 0 && dodYear > 0 && dodYear >= dobYear) {
            const age = dodYear - dobYear;
            totalAge += age;
            ageCount++;
         }
      }
   });

   const averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;

   return {
      averageAge,
      totalPeople: people.length,
      livingPeople: livingCount,
      deceasedPeople: deceasedCount,
      ageCount,
   };
}

/**
 * Get comprehensive statistics for a family tree
 * @param {Object} node - Root node of genealogy tree
 * @returns {Object} - Complete statistics object
 */
export function getTreeStatistics(node) {
   const generations = calculateGenerations(node);
   const ageStats = calculateAverageAge(node);

   return {
      generations,
      averageAge: ageStats.averageAge,
      totalPeople: ageStats.totalPeople,
      livingPeople: ageStats.livingPeople,
      deceasedPeople: ageStats.deceasedPeople,
      peopleWithAgeData: ageStats.ageCount,
   };
}
