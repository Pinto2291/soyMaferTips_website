import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ServiceCard = ({ service, onOpenCart }) => {
  const { store, dispatch } = useGlobalReducer();
  
  const handleAddToCart = () => {
    dispatch({
      type: "add_to_cart",
      payload: service
    });
    // Visual feedback - slide cart open
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const isInCart = store.cart.some(item => item.id === service.id);

  return (
    <div className="service-item glow-hover">
      <img 
        src={service.image_url || "/img/mafer vitamina C.jpg"} 
        alt={service.name} 
        className="service-img" 
      />
      <h3>{service.name}</h3>
      <p className="service-description">{service.description}</p>
      
      {service.price > 0 ? (
        <>
          <p className="service-price">${service.price.toFixed(2)}</p>
          <button 
            onClick={handleAddToCart}
            className={`btn btn-primary add-to-cart-btn ${isInCart ? "disabled" : ""}`}
            disabled={isInCart}
          >
            {isInCart ? "En el Carrito" : "Añadir al Carrito"}
          </button>
        </>
      ) : (
        <>
          <p className="service-price">Precio Variable</p>
          <a href="#contact" className="btn btn-primary">Consultar</a>
        </>
      )}
    </div>
  );
};
