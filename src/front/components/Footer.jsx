import React from "react";

export const Footer = () => {
  return (
    <footer className="footer bg-dark">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Maria Martinez</h3>
            <p>Cosmetóloga y Maquilladora Profesional</p>
            <p>Teléfono: <a href="tel:+584243127589">+584243127589</a></p>
            <p>Email: <a href="mailto:mafertips.1994@gmail.com">mafertips.1994@gmail.com</a></p>
          </div>
          <div className="footer-social">
            <h4>Sígueme:</h4>
            <div className="social-icons-footer">
              <a href="https://www.instagram.com/soymafertips?igsh=ZGxpOXdjY3R3bnhh" target="_blank" rel="noopener noreferrer" className="social-link-footer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@soymafertips?_t=ZS-8wspx287d90&_r=1" target="_blank" rel="noopener noreferrer" className="social-link-footer" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Enlaces Rápidos:</h4>
            <ul>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#courses">Cursos</a></li>
              <li><a href="#experience">Experiencia</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Maria Martinez. Todos los derechos reservados. Diseñado con <i className="fas fa-heart" style={{ color: 'var(--primary-color)' }}></i> por Ignacio Web</p>
        </div>
      </div>
    </footer>
  );
};
