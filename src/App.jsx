import "./App.css";
import React, { useState, useEffect } from "react";
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
import PersonPage from "./components/PersonPage";

export default function App() {
  const [section, setSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [personView, setPersonView] = useState(null);
  const [personQasba, setPersonQasba] = useState(null);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const personId = params.get("person");
    const qasba = params.get("qasba");

    if (personId) {
      setPersonView(personId);
      setPersonQasba(qasba);
      // Set the qasba section if specified
      if (qasba) {
        setSection(qasba);
      }
    }
  }, []);

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setMenuOpen(false);
  };

  const handleNavigateToPerson = (personId) => {
    setPersonView(personId);
    window.history.pushState(null, "", `?person=${personId}&qasba=${section}`);
  };

  const handleClosePerson = () => {
    setPersonView(null);
    setPersonQasba(null);
    window.history.pushState(null, "", window.location.pathname);
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
          {/* Person View Modal */}
          {personView && (
            <div className="personpage-overlay">
              <PersonPage
                personId={personView}
                qasba={personQasba || section}
                data={getCurrentQasbaData(section)}
                onClose={handleClosePerson}
                onNavigateToPerson={handleNavigateToPerson}
              />
            </div>
          )}

          {!personView && (
            <>
              {section === "home" && <Home />}
              {section === "miranbigha" && <NasabMiranBigha setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "simla" && <NasabSimla setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "deora" && <NasabDeora setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "bikopur" && <Bikopur setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "ahmadpur" && <NasabAhmadpur setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "kharbaiyya" && <NasabKharbaiyya setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "palasi" && <NasabPalasi setSection={handleSectionChange} onPersonClick={handleNavigateToPerson} />}
              {section === "books" && <Books />}
              {section === "biography" && <Biography />}
              {section === "khanqah" && <KhanqahList />}
              {section === "graveyards" && <Graveyards />}
              {section === "contribute" && <Contribute />}
              {section === "aboutus" && <AboutUs />}
              {section === "contact" && <ContactUs />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Helper function to get genealogical data for current qasba
 */
function getCurrentQasbaData(section) {
  const dataMap = {
    miranbigha: require("./data/miranbigha.json"),
    simla: require("./data/simla.json"),
    deora: require("./data/deora.json"),
    ahmadpur: require("./data/ahmadpur.json"),
    bikopur: require("./data/bikopur.json"),
    kharbaiyya: require("./data/kharbaiyya.json"),
    palasi: require("./data/palasi.json"),
    nasabpeerbighachakand: require("./data/peerbighachakand.json"),
    nasabsaadipur: require("./data/saadipur.json"),
    makaramchak: require("./data/makaramchak.json"),
  };
  return dataMap[section] || null;
}
