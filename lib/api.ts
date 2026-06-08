import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const fetchProducts = async (params?: any) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

export const fetchProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData);
  return data.data;
};
