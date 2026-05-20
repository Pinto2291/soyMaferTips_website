import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { X, Trash2, MessageSquare } from "lucide-react";

export const Cart = ({ isOpen, onClose }) => {
  const { store, dispatch } = useGlobalReducer();

  const handleRemove = (id) => {
    dispatch({
      type: "remove_from_cart",
      payload: id
    });
  };

  const calculateTotal = () => {
    return store.cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCheckout = () => {
    if (store.cart.length === 0) return;

    const whatsappNumber = "584243127589";
    let invoiceMessage = "Hola María, quisiera solicitar los siguientes servicios:\n\n";
    
    store.cart.forEach(item => {
      invoiceMessage += `- ${item.name}: $${item.price.toFixed(2)}\n`;
    });

    const total = calculateTotal();
    invoiceMessage += `\n*Total a Pagar: $${total.toFixed(2)}*`;
    invoiceMessage += "\n\nPor favor, confírmame la disponibilidad para agendar la cita. ¡Gracias!";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(invoiceMessage)}`;
    
    // Clear cart after checkout
    dispatch({ type: "clear_cart" });
    onClose();
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? "open" : ""}`} onClick={onClose} />
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(218, 165, 32, 0.2)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--primary-color)', margin: 0 }}>Tu Carrito</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color-dark-bg)' }}>
            <X size={24} />
          </button>
        </div>

        {store.cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <p>El carrito está vacío.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Agrega servicios o tratamientos cosmetológicos para comenzar.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
              {store.cart.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>{item.name}</h4>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '5px' }}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(218, 165, 32, 0.2)', paddingTop: '1.5rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary-color)' }}>${calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px' }}
              >
                <MessageSquare size={20} />
                Agendar por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
