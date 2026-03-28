import React, { useState } from 'react';
import '../styles/statisticsPanel.css';

export default function StatisticsPanel({ stats }) {
   const [isExpanded, setIsExpanded] = useState(false);

   if (!stats) {
      return null;
   }

   return (
      <div className="statistics-panel">
         <div className="stats-header-mobile">
            <button
               className="stats-toggle-button"
               onClick={() => setIsExpanded(!isExpanded)}
               aria-label="Toggle statistics"
            >
               {isExpanded ? '−' : '+'}
            </button>
         </div>

         <div className={`stats-horizontal ${isExpanded ? 'expanded' : ''}`}>
            <div className="stat-item-inline">
               <span className="stat-label">Total Gen.</span>
               <span className="stat-value">{stats.generations}</span>
            </div>
            <div className="stat-separator">|</div>

            <div className="stat-item-inline">
               <span className="stat-label">Avg. Lifespan</span>
               <span className="stat-value">{stats.averageAge}y</span>
            </div>
            <div className="stat-separator">|</div>

            <div className="stat-item-inline">
               <span className="stat-label">Total People</span>
               <span className="stat-value">{stats.totalPeople}</span>
            </div>
            <div className="stat-separator">|</div>

            <div className="stat-item-inline">
               <span className="stat-label">Alive</span>
               <span className="stat-value living">{stats.livingPeople}</span>
            </div>
            <div className="stat-separator">|</div>

            <div className="stat-item-inline">
               <span className="stat-label">Deceased</span>
               <span className="stat-value deceased">{stats.deceasedPeople}</span>
            </div>
         </div>
      </div>
   );
}
