import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <div className="navbar d-flex flex-column justify-content-center align-items-center gap-5">
      <div className="navbar-header mb-5">
        <img src={logo} alt="Strength Fit Logo" className="logo" />
        <h2>Strength Fit</h2>
      </div>
      <ul className='mt-5'>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/gestion-usuarios">Gestión de Usuarios</Link>
        </li>
        <li>
          <Link to="/gestion-economica">Gestión Económica</Link>
        </li>
        <li>
          <Link to="/entrenamientos">Gestión de Entrenamientos</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
