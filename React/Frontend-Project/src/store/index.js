import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import membersReducer from './membersSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    theme: themeReducer,
  },
});
