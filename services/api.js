import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3059';
export const fetchActiveNews = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/news/getActiveNews`);
  return data.data || [];
};

export const fetchCategories = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/news/getSpecificCategoryDetails`);
  return data.data || [];
};

export const fetchBanners = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/banner/getBannersBySectionBlog`);
  return data.data || [];
};