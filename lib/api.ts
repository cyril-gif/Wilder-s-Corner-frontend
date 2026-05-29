import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

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