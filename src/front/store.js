export const initialStore = () => {
  return {
    services: [],
    courses: [],
    cart: JSON.parse(localStorage.getItem('mafer_cart')) || [],
    user: JSON.parse(localStorage.getItem('mafer_admin_user')) || null,
    token: localStorage.getItem('mafer_admin_token') || null,
    performanceData: null,
    performanceLogs: []
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_services':
      return {
        ...store,
        services: action.payload
      };

    case 'set_courses':
      return {
        ...store,
        courses: action.payload
      };

    case 'add_to_cart': {
      const isInCart = store.cart.some(item => item.id === action.payload.id);
      if (isInCart) return store;
      
      const newCart = [...store.cart, action.payload];
      localStorage.setItem('mafer_cart', JSON.stringify(newCart));
      return {
        ...store,
        cart: newCart
      };
    }

    case 'remove_from_cart': {
      const newCart = store.cart.filter(item => item.id !== action.payload);
      localStorage.setItem('mafer_cart', JSON.stringify(newCart));
      return {
        ...store,
        cart: newCart
      };
    }

    case 'clear_cart':
      localStorage.removeItem('mafer_cart');
      return {
        ...store,
        cart: []
      };

    case 'set_user':
      localStorage.setItem('mafer_admin_user', JSON.stringify(action.payload.user));
      localStorage.setItem('mafer_admin_token', action.payload.token);
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token
      };

    case 'logout':
      localStorage.removeItem('mafer_admin_user');
      localStorage.removeItem('mafer_admin_token');
      return {
        ...store,
        user: null,
        token: null,
        performanceData: null,
        performanceLogs: []
      };

    case 'set_performance':
      return {
        ...store,
        performanceData: action.payload.averages,
        performanceLogs: action.payload.logs
      };

    default:
      return store;
  }
}
