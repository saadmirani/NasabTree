import "../styles/Navbar.css";
import logo from "../assets/logo.svg";

const HamburgerIcon = () => (
   <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
   </svg>
);

export default function Navbar({ menuOpen, setMenuOpen }) {
   return (
      <header className="navbar">
         <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <HamburgerIcon />
         </button>

         <div className="navbar-left">
            <img src={logo} className="navbar-logo" alt="Bazm-e-Saadaat logo" />
            <h1 className="navbar-title">Bazm-e-Saadaat</h1>
         </div>
      </header>
   );
}


