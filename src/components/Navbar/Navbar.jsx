import React from 'react';
import { Link, } from 'react-router-dom';
import './Navbar.css';
import '../SearchBar/SearchBar';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">Newsip</h1>
      </div>
    </nav>
  );
};

export default Navbar;