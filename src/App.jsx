import "./App.css";
import React, { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./components/Home";
import NasabMiranBigha from "./components/NasabMiranBigha";
import NasabSimla from "./components/NasabSimla";
import NasabDeora from "./components/NasabDeora";
import Bikopur from "./components/bikopur";
import Books from "./components/Books";
import UrsCalendar from "./components/UrsCalendar";
import KhanqahList from "./components/KhanqahList";
import Graveyards from "./components/Graveyards";
import ContactUs from "./components/ContactUs";
import Contribute from "./components/contribute";
import Biography from "./components/Biography";

export default function App() {
  const [section, setSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setMenuOpen(false); // Close menu on mobile when section changes
  };

  return (
    <LanguageProvider>
      <div className="layout">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {menuOpen && (
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
        )}
        <div className="main-area">
          <SideMenu section={section} setSection={handleSectionChange} isOpen={menuOpen} setIsOpen={setMenuOpen} />
          <main className="content">
            {section === "home" && <Home />}
            {section === "miranbigha" && <NasabMiranBigha setSection={handleSectionChange} />}
            {section === "simla" && <NasabSimla setSection={handleSectionChange} />}
            {section === "deora" && <NasabDeora setSection={handleSectionChange} />}
            {section === "bikopur" && <Bikopur setSection={handleSectionChange} />}
            {section === "books" && <Books />}
            {section === "urs" && <UrsCalendar />}
            {section === "khanqah" && <KhanqahList />}
            {section === "graveyards" && <Graveyards />}
            {section === "contact" && <ContactUs />}
            {section === "biography" && <Biography />}
            {section === "contribute" && <Contribute />}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
