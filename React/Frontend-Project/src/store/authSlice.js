import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // { email, role: 'admin' | 'member' }
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      if (email === 'admin@gmail.com' && password === '123456') {
        const adminUser = { email, role: 'admin' };
        state.user = adminUser;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else if (email && password) {
        // Any other non-empty credentials considered as a member
        const memberUser = { email, role: 'member' };
        state.user = memberUser;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(memberUser));
      } else {
        state.error = 'Invalid credentials. Please provide valid email and password.';
      }
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
