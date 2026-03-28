import React, { useState } from 'react';
import '../styles/statisticsPanel.css';

export default function StatisticsPanel({ stats }) {
   const [isOpen, setIsOpen] = useState(false);

   if (!stats) {
      return null;
   }

   return (
      <>
         {isOpen && (
            <div
               className="stats-overlay"
               onClick={() => setIsOpen(false)}
            ></div>
         )}
         <div className="stats-wrapper">
            <button
               className="stats-button"
               onClick={() => setIsOpen(!isOpen)}
               aria-label="Statistics"
            >
               <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
            </button>

            {isOpen && (
               <div className="stats-popup" onClick={(e) => e.stopPropagation()}>
                  <div className="stats-content">
                     <div className="stat-item">
                        <span className="stat-label">Total Generations</span>
                        <span className="stat-value">{stats.generations}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Average Lifespan</span>
                        <span className="stat-value">{stats.averageAge}y</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Total People</span>
                        <span className="stat-value">{stats.totalPeople}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Alive</span>
                        <span className="stat-value living">{stats.livingPeople}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Deceased</span>
                        <span className="stat-value deceased">{stats.deceasedPeople}</span>
                     </div>
                  </div>
                  <div className="legend-divider"></div>
                  <div className="legend-section">
                     <div className="legend-item">
                        <span className="legend-icon male"></span>
                        <span className="legend-text">Male</span>
                     </div>
                     <div className="legend-item">
                        <span className="legend-icon female"></span>
                        <span className="legend-text">Female</span>
                     </div>
                     <div className="legend-item">
                        <span className="legend-icon alive"></span>
                        <span className="legend-text">Alive</span>
                     </div>
                     <div className="legend-item">
                        <span className="legend-icon deceased"></span>
                        <span className="legend-text">Deceased</span>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </>
   );
}
