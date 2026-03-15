import React from 'react';
import '../styles/familyInfoModal.css';

export default function FamilyInfoModal({ isOpen, onClose, familyInfo }) {
   if (!isOpen || !familyInfo) {
      return null;
   }

   return (
      <div className="family-info-modal-overlay" onClick={onClose}>
         <div className="family-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h2>{familyInfo.familyName}</h2>
               <button className="modal-close" onClick={onClose}>
                  ✕
               </button>
            </div>

            <div className="modal-content">
               <div className="info-section">
                  <h3>History & Background</h3>
                  <p>{familyInfo.shortHistory}</p>
               </div>

               <div className="info-section">
                  <h3>Details</h3>
                  <p>{familyInfo.details}</p>
               </div>

               {familyInfo.keyHighlights && familyInfo.keyHighlights.length > 0 && (
                  <div className="info-section">
                     <h3>Key Highlights</h3>
                     <ul className="highlights-list">
                        {familyInfo.keyHighlights.map((highlight, index) => (
                           <li key={index}>{highlight}</li>
                        ))}
                     </ul>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
