import "../styles/Navbar.css";
import logo from "../assets/logo.svg";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
   const { language, toggleLanguage } = useLanguage();

   return (
      <header className="navbar">
         <div className="navbar-left">
            <img src={logo} className="navbar-logo" alt="NasabTree logo" />
            <h1 className="navbar-title">NasabTree</h1>
         </div>

         <div className="language-toggle">
            <button
               className={`lang-toggle ${language}`}
               onClick={toggleLanguage}
            >
               <span className="toggle-label en">EN</span>
               <span className="toggle-label ur">اردو</span>
               <span className="toggle-slider"></span>
            </button>

         </div>
      </header>
   );
}


