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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const url = originalRequest?.url || '';
      const method = (originalRequest?.method || '').toLowerCase();

      // Try to refresh token once
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
          try {
            const resp = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
            const newAccess = resp.data.access;
            localStorage.setItem('token', newAccess);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            return api(originalRequest);
          } catch (refreshErr) {
            // refresh failed, fall through to clearing tokens
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return Promise.reject(error);
          }
        }
      }

      // Allow anonymous GETs for cart/orders to return an empty set for UI
      if (method === 'get' && (url.includes('/cart') || url.includes('/orders'))) {
        return Promise.resolve({ data: { items: [] } });
      }

      // clear tokens for other failures
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  },
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
