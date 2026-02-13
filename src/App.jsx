import "./App.css";
import React, { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./components/Home";
import NasabMiranBigha from "./components/NasabMiranBigha";
import NasabSimla from "./components/NasabSimla";
import NasabDeora from "./components/NasabDeora";
import Books from "./components/Books";
import UrsCalendar from "./components/UrsCalendar";
import KhanqahList from "./components/KhanqahList";
import Graveyards from "./components/Graveyards";
import ContactUs from "./components/ContactUs";

export default function App() {
  const [section, setSection] = useState("home");

  return (
    <LanguageProvider>
      <div className="layout">
        <Navbar />
        <div className="main-area">
          <SideMenu section={section} setSection={setSection} />
          <main className="content">
            {section === "home" && <Home />}
            {section === "miranbigha" && <NasabMiranBigha />}
            {section === "simla" && <NasabSimla />}
            {section === "deora" && <NasabDeora />}
            {section === "books" && <Books />}
            {section === "urs" && <UrsCalendar />}
            {section === "khanqah" && <KhanqahList />}
            {section === "graveyards" && <Graveyards />}
            {section === "contact" && <ContactUs />}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
