import "../styles/Navbar.css";
import logo from "../assets/logo.svg";
import { useLanguage } from "../context/LanguageContext";

const HamburgerIcon = () => (
   <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
   </svg>
);

export default function Navbar({ menuOpen, setMenuOpen }) {
   const { language, toggleLanguage } = useLanguage();

   return (
      <header className="navbar">
         <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <HamburgerIcon />
         </button>

         <div className="navbar-left">
            <img src={logo} className="navbar-logo" alt="Bazm-e-Saadaat logo" />
            <h1 className="navbar-title">Bazm-e-Saadaat</h1>
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


