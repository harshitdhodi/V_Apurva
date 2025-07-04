import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';

// Create a new store instance for each request
export function makeStore() {
  return configureStore({
    reducer: {
      blog: blogReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
}