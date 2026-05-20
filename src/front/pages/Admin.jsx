import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { 
  LogIn, LayoutGrid, DollarSign, BookOpen, Activity, 
  LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, XCircle, Clock
} from "lucide-react";

export const Admin = () => {
  const { store, dispatch } = useGlobalReducer();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  // UI state
  const [activeTab, setActiveTab] = useState("services"); // services, courses, performance
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({ id: "", name: "", price: "", description: "", image_url: "", category: "servicio" });
  
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ id: "", title: "", description: "", image_url: "", button_text: "Más Información" });

  // Fetch performance metrics when the performance tab is opened
  useEffect(() => {
    if (store.token && activeTab === "performance") {
      fetchPerformance();
    }
  }, [activeTab, store.token]);

  const fetchServices = () => {
    fetch(`${BACKEND_URL}/api/services`)
      .then(res => res.json())
      .then(data => dispatch({ type: "set_services", payload: data }))
      .catch(err => console.error("Error reloading services:", err));
  };

  const fetchCourses = () => {
    fetch(`${BACKEND_URL}/api/courses`)
      .then(res => res.json())
      .then(data => dispatch({ type: "set_courses", payload: data }))
      .catch(err => console.error("Error reloading courses:", err));
  };

  const fetchPerformance = () => {
    fetch(`${BACKEND_URL}/api/performance`, {
      headers: {
        "Authorization": `Bearer ${store.token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch metrics");
        return res.json();
      })
      .then(data => {
        dispatch({ type: "set_performance", payload: data });
      })
      .catch(err => console.error("Error fetching performance metrics:", err));
  };

  // --- ACTIONS ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }
        return data;
      })
      .then(data => {
        dispatch({
          type: "set_user",
          payload: { user: data.user, token: data.token }
        });
        setLoginForm({ email: "", password: "" });
        // Fetch services & courses on login success
        fetchServices();
        fetchCourses();
      })
      .catch(err => {
        setErrorMessage(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    dispatch({ type: "logout" });
  };

  // --- SERVICE FORM ACTIONS ---
  const handleServiceEditClick = (service) => {
    setIsEditingService(true);
    setServiceForm(service);
    // Scroll to form
    document.getElementById("service-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleServiceCancel = () => {
    setIsEditingService(false);
    setServiceForm({ id: "", name: "", price: "", description: "", image_url: "", category: "servicio" });
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const isNew = !serviceForm.id;
    const url = isNew 
      ? `${BACKEND_URL}/api/services` 
      : `${BACKEND_URL}/api/services/${serviceForm.id}`;
    const method = isNew ? "POST" : "PUT";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.token}`
      },
      body: JSON.stringify(serviceForm)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save service");
        return res.json();
      })
      .then(() => {
        fetchServices();
        handleServiceCancel();
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  const handleServiceDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;

    fetch(`${BACKEND_URL}/api/services/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${store.token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete service");
        return res.json();
      })
      .then(() => {
        fetchServices();
      })
      .catch(err => alert(err.message));
  };

  // --- COURSE FORM ACTIONS ---
  const handleCourseEditClick = (course) => {
    setIsEditingCourse(true);
    setCourseForm(course);
    document.getElementById("course-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCourseCancel = () => {
    setIsEditingCourse(false);
    setCourseForm({ id: "", title: "", description: "", image_url: "", button_text: "Más Información" });
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const isNew = !courseForm.id;
    const url = isNew 
      ? `${BACKEND_URL}/api/courses` 
      : `${BACKEND_URL}/api/courses/${courseForm.id}`;
    const method = isNew ? "POST" : "PUT";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.token}`
      },
      body: JSON.stringify(courseForm)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save course");
        return res.json();
      })
      .then(() => {
        fetchCourses();
        handleCourseCancel();
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  const handleCourseDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este curso?")) return;

    fetch(`${BACKEND_URL}/api/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${store.token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete course");
        return res.json();
      })
      .then(() => {
        fetchCourses();
      })
      .catch(err => alert(err.message));
  };

  // Helper for performance rating colors
  const getRatingBadge = (rating) => {
    if (rating === "good") return <span className="badge-good"><CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Rápido</span>;
    if (rating === "needs-improvement") return <span className="badge-warning"><AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Moderado</span>;
    return <span className="badge-danger"><XCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Lento</span>;
  };

  const getMetricIcon = (name) => {
    if (name === "LCP") return <Clock size={20} color="var(--primary-color)" />;
    if (name === "FID") return <Activity size={20} color="var(--primary-color)" />;
    return <LayoutGrid size={20} color="var(--primary-color)" />;
  };

  const getMetricDesc = (name) => {
    if (name === "LCP") return "Largest Contentful Paint: Mide la velocidad de carga percibida. El elemento de contenido principal se carga.";
    if (name === "FID") return "First Input Delay: Mide la interactividad de la página. Retraso para que el navegador responda a un clic.";
    if (name === "CLS") return "Cumulative Layout Shift: Mide la estabilidad visual. Desplazamientos inesperados de los bloques de la web.";
    if (name === "TTFB") return "Time to First Byte: Mide el tiempo de respuesta del servidor backend SQLite.";
    return "First Contentful Paint: Velocidad para pintar el primer texto o imagen.";
  };

  // --- VIEW 1: AUTH GATE (LOGIN) ---
  if (!store.token) {
    return (
      <div style={{ backgroundColor: 'var(--dark-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem', border: '1px solid rgba(218, 165, 32, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>SoyMaferTips</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', margin: 0 }}>Panel de Control Administrativo</p>
          </div>

          {errorMessage && (
            <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', borderLeft: '4px solid #ff4444', color: '#ff6666', padding: '10px', fontSize: '0.9rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="email" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email del Administrador:</label>
              <input 
                type="email" 
                id="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                placeholder="ejemplo@soymafertips.com"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(218, 165, 32, 0.2)', padding: '10px', borderRadius: '4px', width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="password" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Contraseña:</label>
              <input 
                type="password" 
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                placeholder="••••••••"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(218, 165, 32, 0.2)', padding: '10px', borderRadius: '4px', width: '100%' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <LogIn size={18} />
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>
              &larr; Volver al Sitio Público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: LOGGED IN DASHBOARD CONTROL PANEL ---
  return (
    <div style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', color: '#fff' }}>
      
      {/* 1. Header Bar */}
      <header style={{ backgroundColor: '#121212', borderBottom: '1px solid rgba(218, 165, 32, 0.2)', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: 0, fontSize: '1.5rem' }}>SoyMaferTips Admin</h1>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Sesión activa como {store.user?.email}</span>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" className="btn btn-secondary" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>
              Ver Web Pública
            </Link>
            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#aa3333' }}>
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* 2. Dashboard Layout */}
      <div className="container" style={{ maxWidth: '1200px', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab("services")} 
            className={`glass-panel glow-hover ${activeTab === "services" ? "active" : ""}`}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
              textAlign: 'left', width: '100%', cursor: 'pointer', borderLeft: activeTab === 'services' ? '4px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'services' ? 'rgba(218, 165, 32, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '0.95rem'
            }}
          >
            <DollarSign size={18} color={activeTab === 'services' ? 'var(--primary-color)' : '#fff'} />
            Servicios y Precios
          </button>
          
          <button 
            onClick={() => setActiveTab("courses")} 
            className={`glass-panel glow-hover ${activeTab === "courses" ? "active" : ""}`}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
              textAlign: 'left', width: '100%', cursor: 'pointer', borderLeft: activeTab === 'courses' ? '4px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'courses' ? 'rgba(218, 165, 32, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '0.95rem'
            }}
          >
            <BookOpen size={18} color={activeTab === 'courses' ? 'var(--primary-color)' : '#fff'} />
            Cursos
          </button>
          
          <button 
            onClick={() => setActiveTab("performance")} 
            className={`glass-panel glow-hover ${activeTab === "performance" ? "active" : ""}`}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
              textAlign: 'left', width: '100%', cursor: 'pointer', borderLeft: activeTab === 'performance' ? '4px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'performance' ? 'rgba(218, 165, 32, 0.1)' : 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '0.95rem'
            }}
          >
            <Activity size={18} color={activeTab === 'performance' ? 'var(--primary-color)' : '#fff'} />
            Rendimiento (Core Vitals)
          </button>
        </aside>

        {/* Content Body */}
        <main className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
          
          {/* TAB 1: SERVICES MANAGER */}
          {activeTab === "services" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(218, 165, 32, 0.2)', paddingBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: 0, fontSize: '1.6rem' }}>Servicios y Precios</h2>
                <button 
                  onClick={() => handleServiceEditClick({ id: "", name: "", price: 0, description: "", image_url: "img/Photos-1-001/maquillaje.jpg", category: "servicio" })} 
                  className="btn btn-primary" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> Nuevo Servicio
                </button>
              </div>

              {/* Service list table */}
              <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(218,165,32,0.2)', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
                      <th style={{ padding: '12px' }}>Foto</th>
                      <th style={{ padding: '12px' }}>Nombre</th>
                      <th style={{ padding: '12px' }}>Categoría</th>
                      <th style={{ padding: '12px' }}>Precio</th>
                      <th style={{ padding: '12px' }}>Descripción</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.services.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <img src={s.image_url} alt="" style={{ width: '45px', height: '45px', borderRadius: '4px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '10px', background: s.category === 'producto' ? 'rgba(0,180,255,0.1)' : 'rgba(218,165,32,0.1)', color: s.category === 'producto' ? '#00b0ff' : 'var(--primary-color)' }}>
                            {s.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                          {s.price > 0 ? `$${s.price.toFixed(2)}` : "Variable"}
                        </td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.description}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button onClick={() => handleServiceEditClick(s)} className="glow-hover" style={{ background: 'rgba(218, 165, 32, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(218, 165, 32, 0.3)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem' }}>
                              <Edit2 size={13} /> Editar
                            </button>
                            <button onClick={() => handleServiceDelete(s.id)} style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff5555', border: '1px solid rgba(255,0,0,0.3)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem' }}>
                              <Trash2 size={13} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Service editor anchor */}
              <div id="service-form-anchor" />

              {/* Service Editor Form (Show only when editing/creating) */}
              {(isEditingService || serviceForm.name !== "") && (
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>
                    {serviceForm.id ? "Editar Servicio" : "Agregar Nuevo Servicio"}
                  </h3>
                  <form onSubmit={handleServiceSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Servicio:</label>
                      <input 
                        type="text" 
                        required
                        value={serviceForm.name} 
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '2 / 3' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Precio ($ USD):</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={serviceForm.price} 
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Coloque 0 para indicar un precio variable (Consultar).</span>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Categoría:</label>
                      <select 
                        value={serviceForm.category} 
                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                        style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      >
                        <option value="servicio">Servicio (Cosmetología/Maquillaje)</option>
                        <option value="producto">Producto de Belleza</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: '2 / 3' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Foto (Ruta Relativa o URL):</label>
                      <input 
                        type="text" 
                        value={serviceForm.image_url} 
                        onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
                      <textarea 
                        rows="3"
                        value={serviceForm.description} 
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button type="button" onClick={handleServiceCancel} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '8px 30px' }}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>

                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSES MANAGER */}
          {activeTab === "courses" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(218, 165, 32, 0.2)', paddingBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: 0, fontSize: '1.6rem' }}>Administración de Cursos</h2>
                <button 
                  onClick={() => handleCourseEditClick({ id: "", title: "", description: "", image_url: "img/auto-maquillaje.JPG", button_text: "Más Información" })} 
                  className="btn btn-primary" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> Nuevo Curso
                </button>
              </div>

              {/* Course list table */}
              <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(218,165,32,0.2)', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
                      <th style={{ padding: '12px' }}>Foto</th>
                      <th style={{ padding: '12px' }}>Título del Curso</th>
                      <th style={{ padding: '12px' }}>Detalle/Descripción</th>
                      <th style={{ padding: '12px' }}>Texto Botón</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.courses.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <img src={c.image_url} alt="" style={{ width: '50px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.title}</td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.description}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{c.button_text}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button onClick={() => handleCourseEditClick(c)} className="glow-hover" style={{ background: 'rgba(218, 165, 32, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(218, 165, 32, 0.3)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem' }}>
                              <Edit2 size={13} /> Editar
                            </button>
                            <button onClick={() => handleCourseDelete(c.id)} style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff5555', border: '1px solid rgba(255,0,0,0.3)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem' }}>
                              <Trash2 size={13} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Course editor anchor */}
              <div id="course-form-anchor" />

              {/* Course Editor Form */}
              {(isEditingCourse || courseForm.title !== "") && (
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>
                    {courseForm.id ? "Editar Curso" : "Agregar Nuevo Curso"}
                  </h3>
                  <form onSubmit={handleCourseSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Título de la Clase:</label>
                      <input 
                        type="text" 
                        required
                        value={courseForm.title} 
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '2 / 3' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Texto del Botón:</label>
                      <input 
                        type="text" 
                        value={courseForm.button_text} 
                        onChange={(e) => setCourseForm({ ...courseForm, button_text: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Foto (Ruta o URL):</label>
                      <input 
                        type="text" 
                        value={courseForm.image_url} 
                        onChange={(e) => setCourseForm({ ...courseForm, image_url: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>Contenido/Descripción del Curso:</label>
                      <textarea 
                        rows="4"
                        value={courseForm.description} 
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button type="button" onClick={handleCourseCancel} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '8px 30px' }}>
                        {loading ? "Guardando..." : "Guardar Curso"}
                      </button>
                    </div>

                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PERFORMANCE AUDIT ROOM */}
          {activeTab === "performance" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(218, 165, 32, 0.2)', paddingBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: 0, fontSize: '1.6rem' }}>Monitoreo en Tiempo Real (Core Web Vitals)</h2>
                <button 
                  onClick={fetchPerformance} 
                  className="btn btn-secondary" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}
                >
                  <Activity size={16} /> Actualizar Datos
                </button>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Esta sección reporta las métricas de rendimiento reales recopiladas directamente de las sesiones de los usuarios del sitio web, utilizando la API integrada <code>web-vitals</code>.
              </p>

              {/* Core Web Vitals Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                
                {store.performanceData && store.performanceData.map(metric => (
                  <div key={metric.metric_name} className={`metric-card ${metric.rating}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{metric.metric_name}</span>
                      {getMetricIcon(metric.metric_name)}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
                      {metric.metric_name === 'CLS' ? metric.avg_value : `${(metric.avg_value / 1000).toFixed(2)}s`}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {getRatingBadge(metric.rating)}
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{metric.count} muestras</span>
                    </div>
                  </div>
                ))}

                {(!store.performanceData || store.performanceData.length === 0) && (
                  <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'rgba(255,255,255,0.5)' }}>
                    Aún no se han recolectado métricas de velocidad. Visita el sitio web público para generar registros automáticos.
                  </div>
                )}

              </div>

              {/* Metric Descriptions and Recommendations */}
              {store.performanceData && store.performanceData.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '1.2rem' }}>Detalles de Métricas y Recomendaciones</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {store.performanceData.map(m => (
                      <div key={m.metric_name} className="glass-panel" style={{ padding: '1.2rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{m.metric_name}</span>
                          {getRatingBadge(m.rating)}
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: '0 0 10px 0' }}>{getMetricDesc(m.metric_name)}</p>
                        
                        {/* Custom diagnostics based on rating */}
                        {m.rating === "good" ? (
                          <p style={{ color: '#81c784', fontSize: '0.85rem', margin: 0, fontWeight: 'bold' }}>
                            ✓ ¡Excelente! El rendimiento de esta sección está dentro de los límites ideales de Google. No requiere acciones.
                          </p>
                        ) : (
                          <div style={{ borderLeft: '3px solid var(--primary-color)', paddingLeft: '10px', marginTop: '10px' }}>
                            <strong style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Acciones de Optimización Sugeridas:</strong>
                            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                              {m.metric_name === 'LCP' && (
                                <>
                                  <li>Comprimir imágenes cargadas en el sitio (usar formato WEBP o reducir tamaño de JPG).</li>
                                  <li>Asegurar lazy loading en las fotos de servicios inferiores.</li>
                                </>
                              )}
                              {m.metric_name === 'FID' && (
                                <>
                                  <li>Optimizar y aplazar scripts de terceros de gran peso (como integraciones pesadas de chat).</li>
                                  <li>Dividir tareas largas de javascript en el renderizado inicial de React.</li>
                                </>
                              )}
                              {m.metric_name === 'CLS' && (
                                <>
                                  <li>Reservar espacio específico asignando alto y ancho explícito en las tarjetas de imagen.</li>
                                  <li>Evitar insertar contenido dinámico sobre elementos ya pintados.</li>
                                </>
                              )}
                              {m.metric_name === 'TTFB' && (
                                <>
                                  <li>SQLite está funcionando de forma correcta, pero para producción se recomienda el hosting PostgreSQL.</li>
                                  <li>Habilitar almacenamiento en caché para peticiones de API estáticas.</li>
                                </>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Log Audit List */}
              {store.performanceLogs && store.performanceLogs.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '1.2rem' }}>Últimos 50 Registros de Navegación</h3>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                          <th style={{ padding: '8px' }}>Métrica</th>
                          <th style={{ padding: '8px' }}>Valor</th>
                          <th style={{ padding: '8px' }}>Diagnóstico</th>
                          <th style={{ padding: '8px' }}>Fecha</th>
                          <th style={{ padding: '8px' }}>Navegador/Agente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.performanceLogs.map(l => (
                          <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{l.metric_name}</td>
                            <td style={{ padding: '8px', color: 'var(--primary-color)' }}>
                              {l.metric_name === 'CLS' ? l.value : `${(l.value / 1000).toFixed(2)}s`}
                            </td>
                            <td style={{ padding: '8px' }}>{getRatingBadge(l.rating)}</td>
                            <td style={{ padding: '8px', color: 'rgba(255,255,255,0.4)' }}>
                              {new Date(l.timestamp).toLocaleString('es-ES', { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                            </td>
                            <td style={{ padding: '8px', color: 'rgba(255,255,255,0.4)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {l.user_agent}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>
    </div>
  );
};
