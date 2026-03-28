import React, { useState, useEffect, useRef } from "react";
import { globalSearch } from "../utils/globalSearch";
import "../styles/searchBox.css";

export default function GlobalSearchBox({ onPersonFound }) {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState([]);
   const [showResults, setShowResults] = useState(false);
   const [isSearching, setIsSearching] = useState(false);
   const searchRef = useRef(null);
   const searchTimeoutRef = useRef(null);

   // Perform search on query change with debouncing
   useEffect(() => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
         clearTimeout(searchTimeoutRef.current);
      }

      if (query.trim().length > 0) {
         setIsSearching(true);
         // Debounce search by 300ms
         searchTimeoutRef.current = setTimeout(() => {
            try {
               const searchResults = globalSearch(query);
               setResults(searchResults);
               setShowResults(true);
            } catch (error) {
               console.error("Search error:", error);
               setResults([]);
            } finally {
               setIsSearching(false);
            }
         }, 300);
      } else {
         setResults([]);
         setShowResults(false);
         setIsSearching(false);
      }

      return () => {
         if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
         }
      };
   }, [query]);

   // Handle click outside to close results
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowResults(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleResultClick = (result) => {
      onPersonFound(result.id, result.qasbaKey);
      setQuery("");
      setShowResults(false);
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter" && results.length > 0) {
         // Select first result on Enter
         handleResultClick(results[0]);
      } else if (e.key === "Escape") {
         setShowResults(false);
      }
   };

   return (
      <div className="global-search-box-wrapper" ref={searchRef}>
         <div className="global-search-container">
            <div className="search-input-wrapper">
               <span className="search-icon">🔍</span>
               <input
                  type="text"
                  className="global-search-input"
                  placeholder="Trace your existence among Saadaat family... Find with which family you have relations"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query.trim().length > 0 && setShowResults(true)}
               />
               {query && (
                  <button
                     className="search-clear-btn"
                     onClick={() => {
                        setQuery("");
                        setShowResults(false);
                     }}
                     aria-label="Clear search"
                  >
                     ✕
                  </button>
               )}
               {isSearching && <span className="search-loading">⟳</span>}
            </div>

            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
               <div className="search-results-dropdown">
                  <div className="search-results-header">
                     Found {results.length} result{results.length !== 1 ? "s" : ""}
                  </div>
                  <ul className="search-results-list">
                     {results.map((result) => (
                        <li
                           key={`${result.qasbaKey}-${result.id}`}
                           className="search-result-item"
                           onClick={() => handleResultClick(result)}
                        >
                           <div className="result-name">{result.name}</div>
                           <div className="result-qasba">{result.qasbaName}</div>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {/* No Results Message */}
            {showResults && query.trim().length > 0 && results.length === 0 && !isSearching && (
               <div className="search-no-results">
                  No exact matches found for "{query}". Try a different name or check the spelling.
               </div>
            )}

            {/* Searching Message */}
            {isSearching && (
               <div className="search-loading-message">
                  Searching across Saadaat families...
               </div>
            )}
         </div>
         <p className="search-hint">
            💡 Search by name to find your ancestors and explore their genealogies across all Qasba families
         </p>
      </div>
   );
}
