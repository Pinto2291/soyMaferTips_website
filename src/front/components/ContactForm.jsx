import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ContactForm = ({ selectedService }) => {
  const { store } = useGlobalReducer();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: ""
  });

  // Pre-select service if passed as prop (from Course Card interaction)
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service: selectedService }));
      // Scroll to contact form
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [selectedService]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, service, message } = formData;

    if (!name || !message) {
      alert("Por favor, completa tu nombre y el mensaje.");
      return;
    }

    const whatsappNumber = "584243127589";
    let whatsappMessage = `Hola María, mi nombre es ${name}. `;
    
    if (phone) {
      whatsappMessage += `Mi teléfono es ${phone}. `;
    }
    if (service) {
      whatsappMessage += `Estoy interesado/a en ${service}. `;
    }
    whatsappMessage += `Mensaje: ${message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <h2 className="section-title">Ponte en Contacto</h2>
        <form onSubmit={handleSubmit} className="contact-form glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group">
            <label htmlFor="name" style={{ color: '#fff', fontWeight: 'bold' }}>Nombre Completo:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '4px' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" style={{ color: '#fff', fontWeight: 'bold' }}>Teléfono (opcional):</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '4px' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="service" style={{ color: '#fff', fontWeight: 'bold' }}>Servicio o Curso de Interés:</label>
            <select 
              id="service" 
              name="service"
              value={formData.service}
              onChange={handleChange}
              style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '4px' }}
            >
              <option value="">Selecciona un servicio...</option>
              {/* Load services dynamically from DB first */}
              {store.services.map(s => (
                <option key={s.id} value={s.name}>{s.name} - ${s.price.toFixed(2)}</option>
              ))}
              {/* Fallback to static list just in case */}
              {store.services.length === 0 && (
                <>
                  <option value="Maquillaje Social">Maquillaje Social</option>
                  <option value="Maquillaje Novias">Maquillaje Novias</option>
                  <option value="Tratamientos Faciales">Tratamientos Faciales</option>
                </>
              )}
              {/* Courses list */}
              <option disabled>──────────</option>
              {store.courses.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
              {store.courses.length === 0 && (
                <>
                  <option value="Curso Automaquillaje">Curso de Automaquillaje</option>
                  <option value="Curso Profesional">Curso de Maquillaje Profesional</option>
                  <option value="Taller de Perfeccionamiento">Taller de Perfeccionamiento</option>
                </>
              )}
              <option value="Otro">Otro (especificar en mensaje)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message" style={{ color: '#fff', fontWeight: 'bold' }}>Mensaje:</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              value={formData.message}
              onChange={handleChange}
              required
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '4px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-form" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>
            Enviar Mensaje por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
};
