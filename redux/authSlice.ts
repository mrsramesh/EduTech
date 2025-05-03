// redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // other reducers...
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;