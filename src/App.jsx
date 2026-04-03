import "./App.css";
import React, { useState, useEffect } from "react";
import { getQasbaRoute } from "./utils/globalSearch";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./components/Home";
import NasabMiranBigha from "./components/NasabMiranBigha";
import NasabSimla from "./components/NasabSimla";
import NasabDeora from "./components/NasabDeora";
import Bikopur from "./components/bikopur";
import NasabAhmadpur from "./components/NasabAhmadpur";
import NasabKharbaiyya from "./components/NasabKharbaiyya";
import NasabPalasi from "./components/NasabPalasi";
import Books from "./components/Books";
import KhanqahList from "./components/KhanqahList";
import Graveyards from "./components/Graveyards";
import ContactUs from "./components/ContactUs";
import Contribute from "./components/contribute";
import Biography from "./components/Biography";
import AboutUs from "./components/AboutUs";

export default function App() {
  const [section, setSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusPersonId, setFocusPersonId] = useState(null);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const personId = params.get("person");
    const qasba = params.get("qasba");

    if (personId && qasba) {
      setSection(qasba);
      setFocusPersonId(personId);
    }
  }, []);

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setFocusPersonId(null); // Clear focus when navigating between sections
    setMenuOpen(false);
    // Clear URL parameters when navigating away from person focus
    window.history.pushState(null, "", window.location.pathname);
  };

  const handleSearchPersonFound = (personId, qasbaKey) => {
    // Get the route name from qasbaKey
    const route = getQasbaRoute(qasbaKey);

    if (!route) {
      console.error("❌ Invalid qasbaKey:", qasbaKey);
      return;
    }

    // Navigate to the Qasba section and focus on the person
    setSection(route);
    setFocusPersonId(personId);
    setMenuOpen(false);
    window.history.pushState(null, "", `?person=${personId}&qasba=${route}`);
  };

  return (
    <div className="layout">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
      <div className="main-area">
        <SideMenu section={section} setSection={handleSectionChange} isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <main className="content">
          {section === "home" && <Home onPersonFound={handleSearchPersonFound} />}
          {section === "miranbigha" && <NasabMiranBigha setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "simla" && <NasabSimla setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "deora" && <NasabDeora setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "bikopur" && <Bikopur setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "ahmadpur" && <NasabAhmadpur setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "kharbaiyya" && <NasabKharbaiyya setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "palasi" && <NasabPalasi setSection={handleSectionChange} focusPersonId={focusPersonId} />}
          {section === "books" && <Books />}
          {section === "biography" && <Biography />}
          {section === "khanqah" && <KhanqahList />}
          {section === "graveyards" && <Graveyards />}
          {section === "contribute" && <Contribute />}
          {section === "aboutus" && <AboutUs />}
          {section === "contact" && <ContactUs />}
        </main>
      </div>
    </div>
  );
}

