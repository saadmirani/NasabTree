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
 * Calculate Levenshtein distance between two strings
 * Measures minimum edits (insert, delete, substitute) needed to transform one string to another
 * Used for fuzzy matching and spelling variation handling
 * 
 * Examples:
 * "Sadiya" -> "Sadia" = 1 (one deletion)
 * "Fozail" -> "Fuzail" = 1 (one substitution)
 * "Ali" -> "Ale" = 1 (one substitution)
 */
const levenshteinDistance = (str1, str2) => {
   const len1 = str1.length;
   const len2 = str2.length;
   const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

   // Initialize first row and column
   for (let i = 0; i <= len1; i++) matrix[0][i] = i;
   for (let j = 0; j <= len2; j++) matrix[j][0] = j;

   // Calculate distances
   for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
         const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
         matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,        // deletion
            matrix[j - 1][i] + 1,        // insertion
            matrix[j - 1][i - 1] + cost  // substitution
         );
      }
   }

   return matrix[len2][len1];
};

/**
 * Convert string to phonetic key for matching variations
 * Helps match names that sound similar but spelled differently
 */
const getPhoneticKey = (str) => {
   // Normalize: remove extra spaces, convert to lowercase
   let phonetic = str.toLowerCase().replace(/\s+/g, '');

   // Common name variations mapping
   const variations = {
      'z': 'z',
      'f': 'f',
      'q': 'k',
      'c': 'k',
      'kh': 'kh',
      'gh': 'gh',
      'sh': 'sh',
      'th': 'th',
      'dh': 'dh'
   };

   return phonetic;
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
 * Considers exact matches, word matches, AND spelling variations via Levenshtein distance
 * 
 * Score breakdown:
 * 100 = Exact match
 * 90  = Starts with query
 * 85  = Exact word match
 * 80  = Contains as whole word
 * 75+ = Close fuzzy match (spelling variations)
 * <70 = Not shown
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
   if (words.some(word => word === queryLower)) return 85;

   // Contains as whole word = 80
   const wordRegex = new RegExp(`\\b${queryLower}\\b`);
   if (wordRegex.test(name)) return 80;

   // If query is 3+ characters, check for close fuzzy matches (spelling variations)
   if (queryLower.length >= 3) {
      // Check each word in the name for fuzzy match
      for (const word of words) {
         if (word.length < 3) continue; // Skip very short words

         const distance = levenshteinDistance(word, queryLower);
         const maxDistance = Math.floor(Math.min(word.length, queryLower.length) * 0.35); // Allow up to 35% distance

         if (distance > 0 && distance <= maxDistance) {
            // Score based on similarity percentage
            // 100% similar (distance 0) = 80, 90% similar = 75, etc.
            const maxLen = Math.max(word.length, queryLower.length);
            const similarity = (maxLen - distance) / maxLen;
            const fuzzyScore = Math.round(70 + similarity * 5); // Score 70-75
            return fuzzyScore;
         }
      }
   }

   // No match
   return -1;
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
 * 
 * Features:
 * - Exact matching (highest priority)
 * - Word matching
 * - Spelling variation handling (Levenshtein distance)
 * - Smart threshold based on query length
 */
export const globalSearch = (query) => {
   if (!query || query.trim().length === 0) {
      return [];
   }

   try {
      const searchIndex = buildSearchIndex();
      const lowerQuery = query.toLowerCase().trim();

      // For short queries (less than 3 chars), require higher match quality
      // For longer queries, allow fuzzy matches
      const minScoreThreshold = lowerQuery.length < 3 ? 85 : 70;

      // Filter and score results
      const scoredResults = searchIndex
         .map(person => ({
            ...person,
            score: calculateRelevanceScore(person.name, lowerQuery)
         }))
         .filter(result => result.score >= minScoreThreshold);

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
