import React from "react";
import "../styles/Sidemenu.css";

const HomeIcon = () => <i className="fas fa-home" style={{ fontSize: "20px" }}></i>;
const NasabIcon = () => <i className="fas fa-sitemap" style={{ fontSize: "20px" }}></i>;
const BooksIcon = () => <i className="fas fa-book" style={{ fontSize: "20px" }}></i>;
const LocationIcon = () => <i className="fas fa-mosque" style={{ fontSize: "20px" }}></i>;
const ContactIcon = () => <i className="fas fa-phone" style={{ fontSize: "20px" }}></i>;
const CalendarIcon = () => <i className="fas fa-calendar" style={{ fontSize: "20px" }}></i>;
const MosqueIcon = () => <i className="fas fa-list" style={{ fontSize: "20px" }}></i>;
const ContributeIcon = () => <i className="fas fa-handshake" style={{ fontSize: "20px" }}></i>;
const BiographyIcon = () => <i className="fas fa-scroll" style={{ fontSize: "20px" }}></i>;
const AboutIcon = () => <i className="fas fa-info-circle" style={{ fontSize: "20px" }}></i>;

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

                  <button
                     className={`submenu-item ${section === "ahmadpur" ? "active" : ""}`}
                     onClick={() => setSection("ahmadpur")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Ahmadpur (Jhikatiya)</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "kharbaiyya" ? "active" : ""}`}
                     onClick={() => setSection("kharbaiyya")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Kharbaiyya</span>
                  </button>

                  <button
                     className={`submenu-item ${section === "palasi" ? "active" : ""}`}
                     onClick={() => setSection("palasi")}
                  >
                     <span className="icon"><NasabIcon /></span>
                     <span className="label">Qasba Palasi</span>
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
            className={`menu-item ${section === "aboutus" ? "active" : ""}`}
            onClick={() => { setShowSilsilas(false); setSection("aboutus"); }}
         >
            <span className="icon"><AboutIcon /></span>
            <span className="label">About Us</span>
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
