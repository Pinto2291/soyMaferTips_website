import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<div style={{ padding: '2rem', textAlign: 'center', color: '#fff', backgroundColor: '#000', minHeight: '100vh' }}><h1>Página no encontrada</h1><a href="/" style={{ color: 'var(--primary-color)' }}>Volver al Inicio</a></div>} >
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Full-Stack Database Admin Control Panel */}
        <Route path="/admin" element={<Admin />} />
      </Route>
    )
);