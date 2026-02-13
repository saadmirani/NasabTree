import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
   const [language, setLanguage] = useState("en");

   const toggleLanguage = () => {
      setLanguage((prev) => (prev === "en" ? "ur" : "en"));
   };

   return (
      <LanguageContext.Provider value={{ language, toggleLanguage }}>
         {children}
      </LanguageContext.Provider>
   );
}

export function useLanguage() {
   const context = useContext(LanguageContext);
   if (!context) {
      throw new Error("useLanguage must be used within LanguageProvider");
   }
   return context;
}
