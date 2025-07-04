import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [],
  categories: [],
  banners: [],
  searchQuery: '',
  selectedCategory: 'All',
  status: 'idle',
  error: null
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBanners: (state, action) => {
      state.banners = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const { 
  setBlogs, 
  setCategories, 
  setBanners, 
  setSearchQuery, 
  setSelectedCategory 
} = blogSlice.actions;

export default blogSlice.reducer;