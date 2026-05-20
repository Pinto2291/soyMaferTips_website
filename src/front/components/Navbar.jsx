import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ShoppingCart, Menu, X } from "lucide-react";

export const Navbar = ({ onOpenCart }) => {
  const { store } = useGlobalReducer();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-container container">
          <a href="#hero" className="navbar-logo">Maria Martinez</a>
          
          <div className="navbar-cart-container">
            <button onClick={onOpenCart} className="cart-icon-link" aria-label="Abrir carrito" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <ShoppingCart size={22} color="var(--primary-color)" />
              <span id="cart-item-count" className={`cart-item-count ${store.cart.length > 0 ? 'active' : ''}`}>
                {store.cart.length}
              </span>
            </button>
          </div>

          <button className={`navbar-toggler ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation" aria-expanded={isOpen}>
            {isOpen ? <X size={24} color="#fff" /> : (
              <>
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
              </>
            )}
          </button>

          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <li className="nav-item"><a href="#hero" onClick={handleLinkClick} className="nav-link">Inicio</a></li>
            <li className="nav-item"><a href="#services" onClick={handleLinkClick} className="nav-link">Servicios y Productos</a></li>
            <li className="nav-item"><a href="#courses" onClick={handleLinkClick} className="nav-link">Cursos</a></li>
            <li className="nav-item"><a href="#experience" onClick={handleLinkClick} className="nav-link">Experiencia</a></li>
            <li className="nav-item"><a href="#social" onClick={handleLinkClick} className="nav-link">Redes Sociales</a></li>
            <li className="nav-item"><a href="#contact" onClick={handleLinkClick} className="nav-link">Contacto</a></li>
            <li className="nav-item">
              <Link to="/admin" onClick={handleLinkClick} className="nav-link" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};