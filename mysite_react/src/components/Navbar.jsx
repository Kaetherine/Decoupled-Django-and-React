import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          Mindr
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          {/* Left side - Main navigation */}
          <div className="navbar-nav navbar-nav-left">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/articles" 
              className={`navbar-link ${isActive('/articles')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
          </div>
          
                           {/* Right side - Auth Links */}
                 <div className="navbar-nav navbar-nav-right">
                   <Link
                     to="/login"
                     className="navbar-link"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Login
                   </Link>
                   <Link
                     to="/register"
                     className="navbar-link"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Register
                   </Link>
                 </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 