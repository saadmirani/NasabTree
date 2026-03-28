// Global search utility for finding people across all Qasba data
// Uses statically imported Nas*.json files for reliable loading

// Static imports of all Qasba data files
import Nasmiranbigha from "../data/Nasmiranbigha.json";
import Nassimla from "../data/Nassimla.json";
import Nasdeora from "../data/Nasdeora.json";
import Nasahmadpur from "../data/Nasahmadpur.json";
import Nasbikopur from "../data/Nasbikopur.json";
import Naskharbaiyya from "../data/Naskharbaiyya.json";
import Naspalasi from "../data/Naspalasi.json";

// Map of qasba keys to their data
const qasbaDataMap = {
   miranbigha: Nasmiranbigha,
   simla: Nassimla,
   deora: Nasdeora,
   ahmadpur: Nasahmadpur,
   bikopur: Nasbikopur,
   kharbaiyya: Naskharbaiyya,
   palasi: Naspalasi,
};

/**
 * Load Qasba data from the static map
 */
const loadQasbaData = (qasbaKey) => {
   const data = qasbaDataMap[qasbaKey];
   if (!data) {
      console.warn(`No data found for Qasba: ${qasbaKey}`);
   }
   return data || null;
};

/**
 * Get all available Qasbas by dynamically discovering Nas*.json files
 */
const getAvailableQasbas = () => {
   // List of known qasbas - this is the only place where metadata is stored
   // If you add a new qasba, just add it here (one line!)
   const qasbas = [
      { key: "miranbigha", name: "Qasba Miran Bigha" },
      { key: "simla", name: "Qasba Simla" },
      { key: "deora", name: "Qasba Deora" },
      { key: "bikopur", name: "Qasba Bikopur" },
      { key: "ahmadpur", name: "Qasba Ahmadpur" },
      { key: "kharbaiyya", name: "Qasba Kharbaiyya" },
      { key: "palasi", name: "Qasba Palasi" }
   ];

   return qasbas.map(qasba => ({
      ...qasba,
      route: qasba.key
   }));
};

/**
 * Recursively flatten all people in the family tree into a searchable list
 */
const flattenFamilyTree = (node, qasbaKey, qasbaName) => {
   const results = [];

   const traverse = (person) => {
      if (person && person.id && person.name) {
         results.push({
            id: person.id,
            name: person.name,
            qasbaKey,
            qasbaName
         });
      }

      if (person?.children && Array.isArray(person.children)) {
         person.children.forEach(child => traverse(child));
      }
   };

   traverse(node);
   return results;
};

/**
 * Calculate relevance score for a search result
 * Higher score = better match
 */
const calculateRelevanceScore = (personName, query) => {
   const name = personName.toLowerCase();
   const queryLower = query.toLowerCase();

   // Exact match = 100
   if (name === queryLower) return 100;

   // Starts with query = 90
   if (name.startsWith(queryLower)) return 90;

   // Whole word match at start of sentence = 85
   const words = name.split(/[\s\-]+/);
   if (words.some(word => word.startsWith(queryLower))) return 85;

   // Contains as whole word = 70
   const wordRegex = new RegExp(`\\b${queryLower}\\b`);
   if (wordRegex.test(name)) return 70;

   // Contains the query but not as whole word = 0 (don't show)
   if (name.includes(queryLower)) return 0;

   return -1; // Not a match
};

/**
 * Build a complete searchable index of all people across all Qasbas
 */
const buildSearchIndex = () => {
   const index = [];
   const qasbas = getAvailableQasbas();

   for (const qasbaInfo of qasbas) {
      try {
         const data = loadQasbaData(qasbaInfo.key);

         if (data) {
            const flattenedPeople = flattenFamilyTree(
               data,
               qasbaInfo.key,
               qasbaInfo.name
            );
            index.push(...flattenedPeople);
         }
      } catch (error) {
         console.warn(`Failed to build index for ${qasbaInfo.name}:`, error);
      }
   }

   return index;
};

/**
 * Search across all Qasbas for people matching the query
 * Returns an array of results with id, name, qasbaKey, and qasbaName
 * sorted by relevance
 */
export const globalSearch = (query) => {
   if (!query || query.trim().length === 0) {
      return [];
   }

   try {
      const searchIndex = buildSearchIndex();
      const lowerQuery = query.toLowerCase().trim();

      // Filter and score results
      const scoredResults = searchIndex
         .map(person => ({
            ...person,
            score: calculateRelevanceScore(person.name, lowerQuery)
         }))
         .filter(result => result.score >= 70); // Minimum relevance score

      // Sort by relevance score (highest first)
      scoredResults.sort((a, b) => b.score - a.score);

      // Remove score from final results
      return scoredResults.map(({ score, ...person }) => person);
   } catch (error) {
      console.error("Search error:", error);
      return [];
   }
};

/**
 * Get the route name for a Qasba
 */
export const getQasbaRoute = (qasbaKey) => {
   const qasbas = getAvailableQasbas();
   const qasba = qasbas.find(q => q.key === qasbaKey);
   return qasba?.route;
};

/**
 * Get all available Qasbas
 */
export const getAllQasbas = () => {
   return getAvailableQasbas();
};
