import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from '../../img/gs3.png';

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light ">
        <img className="img-logo" src={logo} alt="Logomarca" />
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Link className="nav-item active ml-2" to="/clientes">
            Clientes
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
