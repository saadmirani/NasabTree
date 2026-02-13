import React from "react";
import "../styles/Sidemenu.css";

const HomeIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
   </svg>
);

const NasabIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      {/* Genealogy tree icon */}
      <circle cx="12" cy="4" r="2" />
      <line x1="12" y1="6" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <line x1="8" y1="14" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="14" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="20" r="1.5" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="14" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <line x1="12" y1="8" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="8" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" />
   </svg>
);

const BooksIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h12v16z" />
   </svg>
);

const LocationIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
   </svg>
);

const ContactIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M17 10.5V7c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
   </svg>
);

export default function SideMenu({ section, setSection }) {
   const [showSilsilas, setShowSilsilas] = React.useState(false);

   return (
      <nav className="sidemenu">
         <button
            className={`menu-item ${section === "home" ? "active" : ""}`}
            onClick={() => setSection("home")}
         >
            <span className="icon"><HomeIcon /></span>
            <span className="label">Home</span>
         </button>

         <div className="menu-section">
            <button
               className={`menu-item ${section === "miranbigha" || section === "simla" || section === "deora" ? "active" : ""
                  }`}
               onClick={() => setShowSilsilas(!showSilsilas)}
            >
               <span className="icon"><NasabIcon /></span>
               <span className="label">Silsilas</span>
               <span className={`submenu-arrow ${showSilsilas ? "open" : ""}`}>▼</span>
            </button>

            {showSilsilas && (
               <div className="submenu">
                  <button
                     className={`submenu-item ${section === "miranbigha" ? "active" : ""}`}
                     onClick={() => setSection("miranbigha")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Miran Bigha</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "simla" ? "active" : ""}`}
                     onClick={() => setSection("simla")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Simla</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "deora" ? "active" : ""}`}
                     onClick={() => setSection("deora")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Deora</span>
                  </button>
               </div>
            )}
         </div>

         <button
            className={`menu-item coming-soon ${section === "books" ? "active" : ""}`}
            onClick={() => setSection("books")}
         >
            <span className="icon"><BooksIcon /></span>
            <span className="label">Books</span>
         </button>

         <button
            className={`menu-item coming-soon ${section === "graveyards" ? "active" : ""}`}
            onClick={() => setSection("graveyards")}
         >
            <span className="icon"><LocationIcon /></span>
            <span className="label">Graveyards</span>
         </button>

         <button
            className={`menu-item ${section === "contact" ? "active" : ""}`}
            onClick={() => setSection("contact")}
         >
            <span className="icon"><ContactIcon /></span>
            <span className="label">Contact Us</span>
         </button>
      </nav>
   );
}
