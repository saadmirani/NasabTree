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
      {/* Left page */}
      <path d="M4 4h8v16H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Right page */}
      <path d="M12 4h8v16h-8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Spine/fold */}
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
      {/* Lines on left page */}
      <line x1="5" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="5" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="5" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      {/* Lines on right page */}
      <line x1="13" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="13" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="13" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
   </svg>
);

const LocationIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      {/* Dome/Rouza top - semi-circle */}
      <path d="M7 9c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Dome curve continuation */}
      <path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {/* Main chamber/base */}
      <rect x="7" y="9" width="10" height="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Decorative arched entrance/niche */}
      <path d="M11 12c0-.5 0.4-1 1-1s1 0.4 1 1" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Ground foundation */}
      <line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" />
      {/* Spire/finial on top - crescent or point */}
      <line x1="12" y1="4" x2="12" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="1.5" r="0.6" fill="currentColor" />
   </svg>
);

const ContactIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      {/* Envelope body */}
      <rect x="2" y="5" width="20" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Triangle flap - left */}
      <line x1="2" y1="5" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" />
      {/* Triangle flap - right */}
      <line x1="22" y1="5" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" />
   </svg>
);

const CalendarIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
   </svg>
);

const MosqueIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M12 2L4 6v8h2v6h12v-6h2V6l-8-4zm0 3l5 2.5V10h-2v4h-6v-4H7V7.5l5-2.5zm-3 10h2v4h2v-4h2v4h2v-4h1v6H6v-6z" />
   </svg>
);

const ContributeIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5M11 10h2v3h3v2h-3v3h-2v-3H8v-2h3v-3z" />
   </svg>
);

const BiographyIcon = () => (
   <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      {/* Notepad */}
      <rect x="2" y="4" width="14" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Lines on notepad */}
      <line x1="4" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="4" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="4" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Pen */}
      <line x1="15" y1="5" x2="22" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="2" r="1.2" fill="currentColor" />
   </svg>
);

export default function SideMenu({ section, setSection, isOpen, setIsOpen }) {
   const [showSilsilas, setShowSilsilas] = React.useState(false);

   return (
      <nav className={`sidemenu ${isOpen ? "open" : ""}`}>
         <button
            className={`menu-item ${section === "home" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("home"); }}
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
               <span className="label">Shajra-e-Saadaat</span>
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

                  <button
                     className={`submenu-item ${section === "peerbigha" ? "active" : ""}`}
                     onClick={() => setSection("peerbigha")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Peer Bigha</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "saadipur" ? "active" : ""}`}
                     onClick={() => setSection("saadipur")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Saadipur</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "bikopur" ? "active" : ""}`}
                     onClick={() => setSection("bikopur")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Bikopur</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "ramsagar" ? "active" : ""}`}
                     onClick={() => setSection("ramsagar")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Ramsagar</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "amjhar" ? "active" : ""}`}
                     onClick={() => setSection("amjhar")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Amjhar</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "maner" ? "active" : ""}`}
                     onClick={() => setSection("maner")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Maner</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "makaram" ? "active" : ""}`}
                     onClick={() => setSection("makaram")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Makaram Chak</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "arwal" ? "active" : ""}`}
                     onClick={() => setSection("arwal")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Arwal</span>
                  </button>
               </div>
            )}
         </div>

         <button
            className={`menu-item ${section === "books" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("books"); }}
         >
            <span className="icon"><BooksIcon /></span>
            <span className="label">Books</span>
         </button>

         <button
            className={`menu-item ${section === "urs" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("urs"); }}
         >
            <span className="icon"><CalendarIcon /></span>
            <span className="label">Urs Calendar</span>
         </button>

         <button
            className={`menu-item ${section === "khanqah" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("khanqah"); }}
         >
            <span className="icon"><MosqueIcon /></span>
            <span className="label">Khanqah List</span>
         </button>

         <button
            className={`menu-item coming-soon ${section === "graveyards" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("graveyards"); }}
         >
            <span className="icon"><LocationIcon /></span>
            <span className="label">Graveyards</span>
         </button>

         <button
            className={`menu-item ${section === "contact" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("contact"); }}
         >
            <span className="icon"><ContactIcon /></span>
            <span className="label">Contact Us</span>
         </button>

         <button
            className={`menu-item ${section === "biography" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("biography"); }}
         >
            <span className="icon"><BiographyIcon /></span>
            <span className="label">Biography</span>
         </button>

         <button
            className={`menu-item ${section === "contribute" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("contribute"); }}
         >
            <span className="icon"><ContributeIcon /></span>
            <span className="label">Contribute</span>
         </button>
      </nav>
   );
}
