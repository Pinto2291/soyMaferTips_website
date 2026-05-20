import React from "react";

export const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <h1 className="hero-title animate-on-scroll">Maria Martinez</h1>
        <p className="hero-subtitle">Cosmetóloga y Maquilladora Profesional</p>
        <a href="#contact" className="btn btn-primary btn-hero">Contáctame</a>
      </div>
    </section>
  );
};
