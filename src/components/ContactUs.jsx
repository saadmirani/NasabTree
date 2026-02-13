import React from "react";
import "../styles/contact.css";

export default function ContactUs() {
   return (
      <div className="contact-container">
         <section className="contact-hero">
            <h1>Contact Us</h1>
            <p>Get in Touch with Us</p>
         </section>

         <div className="contact-wrapper">
            <section className="contact-info-section">
               <h2>Contact Information</h2>

               <div className="contact-card">
                  <div className="contact-card-icon">👤</div>
                  <h3>Developer & Project Lead</h3>
                  <p className="contact-name">Saad Ahmad Mirani</p>
               </div>

               <div className="contact-card">
                  <div className="contact-card-icon">✉️</div>
                  <h3>Email</h3>
                  <p>
                     <a href="mailto:saadahmadmirani2026@gmail.com" className="contact-link">
                        ahmadmirani2026@gmail.com
                     </a>
                  </p>
               </div>

               <div className="contact-card">
                  <div className="contact-card-icon">📞</div>
                  <h3>Phone</h3>
                  <p>
                     <a href="tel:+917091409115" className="contact-link">
                        +91-7091409115
                     </a>
                  </p>
               </div>
            </section>

            <section className="locations-section">
               <h2>Visit Us In Person</h2>

               <div className="location-card">
                  <div className="location-icon">🕌</div>
                  <h3>Khanqah Miran Bheek</h3>
                  <p className="location-address">
                     Miran Bigha, Tekari<br />
                     Gaya, Bihar<br />
                     India
                  </p>
                  <p className="location-description">
                     The spiritual center and seat of our heritage
                  </p>
               </div>

               <div className="location-card">
                  <div className="location-icon">🏠</div>
                  <h3>Residence of Saad Ahmad Mirani</h3>
                  <p className="location-address">
                     Bait-ul-Miran<br />
                     Quazi Mohalla, Sherghati<br />
                     Gaya, Bihar<br />
                     India
                  </p>
                  <p className="location-description">
                     Personal residence for meetings and discussions
                  </p>
               </div>
            </section>
         </div>

         <section className="contact-message">
            <h2>We Look Forward to Hearing From You</h2>
            <p>
               Whether you have questions about our genealogies, want to contribute information,
               or simply wish to learn more about the heritage and teachings of our Sufi saints,
               we welcome your contact.
            </p>
            <p>
               Feel free to reach out via email or phone, or visit us in person at either of our locations.
            </p>
         </section>
      </div>
   );
}
