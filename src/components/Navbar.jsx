import "../styles/Navbar.css";
import logo from "../assets/logo.svg";

export default function Navbar() {
   return (
      <header className="navbar">
         <img src={logo} className="navbar-logo" alt="NasabTree logo" />
         <h1 className="navbar-title">NasabTree</h1>
      </header>
   );
}


