import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { ServiceCard } from "../components/ServiceCard";
import { CourseCard } from "../components/CourseCard";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/Footer";
import { Cart } from "../components/Cart";
import { ShoppingCart } from "lucide-react";
import { startPerformanceMonitoring } from "../utils/webVitals";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCourseForInfo, setSelectedCourseForInfo] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  // 1. Fetch data on load and start Web Vitals tracking
  useEffect(() => {
    // Start measuring page speed automatically!
    startPerformanceMonitoring();

    // Fetch services
    fetch(`${BACKEND_URL}/api/services`)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "set_services", payload: data });
      })
      .catch(err => console.error("Error fetching services:", err));

    // Fetch courses
    fetch(`${BACKEND_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "set_courses", payload: data });
      })
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleSelectCourse = (courseTitle) => {
    setSelectedCourseForInfo(courseTitle);
  };

  return (
    <div style={{ backgroundColor: 'var(--dark-color)', minHeight: '100vh', position: 'relative' }}>
      {/* 1. Header Navigation */}
      <Navbar onOpenCart={handleOpenCart} />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Public Sections */}
      <main>
        {/* Services & Products */}
        <section id="services" className="services-section section-padding">
          <div className="container">
            <h2 className="section-title">Servicios y Productos</h2>
            <div className="services-grid">
              {store.services.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onOpenCart={handleOpenCart} 
                />
              ))}
              {store.services.length === 0 && (
                <div className="text-center" style={{ color: 'rgba(255,255,255,0.6)', padding: '2rem', gridColumn: '1 / -1' }}>
                  Cargando tratamientos de belleza...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="courses-section section-padding bg-light">
          <div className="container">
            <h2 className="section-title" style={{ color: 'var(--text-color-light-bg)' }}>Cursos de Maquillaje</h2>
            <div className="courses-grid">
              {store.courses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onSelectCourse={handleSelectCourse} 
                />
              ))}
              {store.courses.length === 0 && (
                <div className="text-center" style={{ color: 'rgba(0,0,0,0.6)', padding: '2rem', gridColumn: '1 / -1' }}>
                  Cargando cursos de cosmetología...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="experience-section section-padding">
          <div className="container">
            <h2 className="section-title">Mi Experiencia</h2>
            <div className="experience-content">
              <div className="experience-image">
                <img src="/img/IMG_8675.JPG" alt="Maria Martinez trabajando en maquillaje" className="responsive-img" />
              </div>
              <div className="experience-text">
                <p>Con más de <strong>8 años de experiencia</strong> en el mundo de la belleza, he tenido el placer de trabajar con cientos de clientas, realzando su belleza natural para ocasiones especiales y enseñando mis técnicas a futuras promesas del maquillaje.</p>
                <p>Mi formación continua y mi pasión por el arte del maquillaje me permiten estar siempre al día con las últimas tendencias y productos. He participado en:</p>
                <ul>
                  <li>Masterclasses con reconocidos maquilladores internacionales.</li>
                  <li>Certificaciones en cosmetología y cuidado de la piel.</li>
                  <li>Colaboraciones en eventos de moda y sesiones fotográficas.</li>
                </ul>
                <p>Mi objetivo es que cada persona que confía en mis manos se sienta radiante, segura y satisfecha con el resultado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Networks */}
        <section id="social" className="social-section section-padding bg-dark">
          <div className="container text-center">
            <h2 className="section-title">Sígueme en Redes Sociales</h2>
            <div className="social-icons">
              <a href="https://www.instagram.com/soymafertips?igsh=ZGxpOXdjY3R3bnhh" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@soymafertips?_t=ZS-8wspx287d90&_r=1" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm selectedService={selectedCourseForInfo} />
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Cart Drawer */}
      <Cart isOpen={isCartOpen} onClose={handleCloseCart} />

      {/* 6. Floating Shopping Cart Button (Premium touch) */}
      {store.cart.length > 0 && (
        <button 
          onClick={handleOpenCart} 
          className="floating-cart-btn" 
          aria-label="Ver carrito"
        >
          <ShoppingCart size={26} />
          <span className="floating-cart-badge">{store.cart.length}</span>
        </button>
      )}
    </div>
  );
};