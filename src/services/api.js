import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const method = (error.config?.method || '').toLowerCase();
      // Allow anonymous GETs for cart/orders to return an empty set for UI
      if (method === 'get' && (url.includes('/cart') || url.includes('/orders'))) {
        return Promise.resolve({ data: { items: [] } });
      }
      // For mutating cart/order requests (POST/PUT/DELETE) reject so frontend fallbacks run
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);
export const getArtisans = () => api.get('/artisans/');
export const getArtisan = (id) => api.get(`/artisans/${id}/`);
export const getCategories = () => api.get('/categories/');
export const getCart = () => api.get('/cart/');
export const addToCart = (data) => api.post('/cart/add/', data);
export const updateCartItem = (data) => api.put(`/cart/items/${data.item_id}/`, data);
export const removeFromCart = (data) => api.delete(`/cart/items/${data.item_id}/`);
export const createOrder = (data) => api.post('/orders/create/', data);
export const login = (data) => api.post('/token/', data);
export const refreshToken = (data) => api.post('/token/refresh/', data);

export default api;