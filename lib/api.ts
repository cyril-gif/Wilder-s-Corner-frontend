import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

// Products
export const fetchProducts = async (params?: any) => {
  const { data } = await api.get('/products', { params });
  return data.data;
};

export const fetchProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const fetchFeaturedProducts = async () => {
  const { data } = await api.get('/products/featured');
  return data.data;
};

export const fetchFlashSales = async () => {
  const { data } = await api.get('/products/flash-sales');
  return data.data;
};

// Categories
export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

// Orders
export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData);
  return data.data;
};

export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/my-orders');
  return data.data;
};

export const fetchOrderById = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

// Auth (if needed)
export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};






