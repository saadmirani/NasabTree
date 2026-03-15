import React from 'react';
import '../styles/statisticsPanel.css';

export default function StatisticsPanel({ stats }) {
   if (!stats) {
      return null;
   }

   return (
      <div className="statistics-panel">
         <div className="stats-horizontal">
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
