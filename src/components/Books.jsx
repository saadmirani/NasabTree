import React from "react";
import "../styles/home.css";

export default function Books() {
   return (
      <div className="home-container">
         <section className="hero">
            <div className="hero-content">
               <h1>Digital Library</h1>
               <p className="subtitle">Books & Historical Texts</p>
               <p className="tagline">Coming Soon</p>
            </div>
         </section>

         <section className="section cta-section">
            <h2>📚 Books Section - Coming Soon</h2>
            <p style={{ fontSize: "1.1em", marginTop: "30px" }}>
               We are working on digitizing and transcribing historical books related to
               <strong> Saadat-e-Bihar</strong> and other important texts about our spiritual heritage.
            </p>
            <p style={{ fontSize: "1.1em", marginBottom: "30px" }}>
               Many of these books are not yet transcribed or easily accessible.
               We are committed to bringing them to you in a digital format soon.
            </p>
            <div style={{
               padding: "30px",
               background: "rgba(255, 255, 255, 0.1)",
               borderRadius: "8px",
               marginTop: "30px"
            }}>
               <p style={{ fontSize: "1em", marginBottom: "10px" }}>
                  ⏳ Check back soon for:
               </p>
               <ul style={{ textAlign: "left", display: "inline-block" }}>
                  <li>Historical chronicles of Saadat communities</li>
                  <li>Spiritual teachings and wisdom texts</li>
                  <li>Biographical collections</li>
                  <li>Research materials and documents</li>
               </ul>
            </div>
         </section>
      </div>
   );
}
