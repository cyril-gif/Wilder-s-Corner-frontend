import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export const fetchProducts = async (params?: any) => {
  const queryParams = new URLSearchParams();
  
  if (params?.category) queryParams.append('category', params.category);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page) queryParams.append('page', params.page);
  if (params?.limit) queryParams.append('limit', params.limit);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice);
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice);
  if (params?.isFlashSale) queryParams.append('isFlashSale', 'true');
  if (params?.isFeatured) queryParams.append('isFeatured', 'true');
  
  const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const { data } = await api.get(url);
  return data.data;
};

