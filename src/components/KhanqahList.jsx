import React, { useState, memo } from "react";
import khanqahData from "../data/khanqah.json";
import "../styles/khanqah.css";

export default function KhanqahList() {
   const [selectedKhanqah, setSelectedKhanqah] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   const filteredKhanqahs = khanqahData.filter((khanqah) =>
      khanqah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      khanqah.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      khanqah.state.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="khanqah-container">
         <section className="khanqah-section">
            <h1>Fehrist-e-Khanqah Auliya-e-Karaam</h1>

            <div className="khanqah-search">
               <input
                  type="text"
                  placeholder="Search by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
               />
            </div>

            <div className="khanqah-cards-grid">
               {filteredKhanqahs.length > 0 ? (
                  filteredKhanqahs.map((khanqah) => (
                     <KhanqahCard
                        key={khanqah.id}
                        khanqah={khanqah}
                        onClick={() => setSelectedKhanqah(khanqah)}
                     />
                  ))
               ) : (
                  <p className="no-results">No Khanqahs found</p>
               )}
            </div>
         </section>

         {/* Khanqah Detail Popup */}
         {selectedKhanqah && (
            <KhanqahDetailPopup khanqah={selectedKhanqah} onClose={() => setSelectedKhanqah(null)} />
         )}
      </div>
   );
}

const KhanqahCard = memo(function KhanqahCard({ khanqah, onClick }) {
   return (
      <div className="khanqah-card" onClick={onClick}>
         <div className="khanqah-card-header">
            <h3>{khanqah.name}</h3>
            {khanqah.titleArabic && <p className="khanqah-title-arabic">{khanqah.titleArabic}</p>}
         </div>
         <div className="khanqah-card-info">
            <p className="khanqah-location">
               <span className="icon">📍</span> {khanqah.city}, {khanqah.state}
            </p>
            <p className="khanqah-order">
               <span className="icon">🌿</span> {khanqah.order}
            </p>
            <p className="khanqah-sajjada">
               <span className="icon">👤</span> {khanqah.sajjadaNashinName || "None"}
            </p>
         </div>
      </div>
   );
});

const KhanqahDetailPopup = memo(function KhanqahDetailPopup({ khanqah, onClose }) {
   return (
      <div className="khanqah-popup-overlay" onClick={onClose}>
         <div className="khanqah-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popupbtn-close" onClick={onClose}>×</button>
            <div className="khanqah-popup-content">
               <h2>{khanqah.name}</h2>
               {khanqah.titleArabic && <p className="title-arabic">{khanqah.titleArabic}</p>}

               <div className="khanqah-details">
                  <div className="detail-row">
                     <strong>Year of Establishment:</strong>
                     <span>{khanqah.yearOfEstablishment || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Founder:</strong>
                     <span>{khanqah.founderName || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Order:</strong>
                     <span>{khanqah.order || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Sajjada Nashin Name:</strong>
                     <span>{khanqah.sajjadaNashinName || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Current Sajjada Nashin:</strong>
                     <span>{khanqah.principalSajjadaNashin || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Address:</strong>
                     <span>{khanqah.address || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>City:</strong>
                     <span>{khanqah.city || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>State:</strong>
                     <span>{khanqah.state || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Country:</strong>
                     <span>{khanqah.country || "None"}</span>
                  </div>
                  {khanqah.phoneNumber && (
                     <div className="detail-row">
                        <strong>Phone:</strong>
                        <span>{khanqah.phoneNumber}</span>
                     </div>
                  )}
                  {khanqah.emailAddress && (
                     <div className="detail-row">
                        <strong>Email:</strong>
                        <span>
                           <a href={`mailto:${khanqah.emailAddress}`}>{khanqah.emailAddress}</a>
                        </span>
                     </div>
                  )}
                  {khanqah.mapLink && (
                     <div className="detail-row">
                        <a href={khanqah.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                           🗺️ View on Google Maps
                        </a>
                     </div>
                  )}
               </div>

               {khanqah.description && (
                  <div className="khanqah-description">
                     <h3>About</h3>
                     <p>{khanqah.description}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
});
