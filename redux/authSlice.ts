
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'student' | 'teacher';
//   profileImage?: string;
// }

// interface AuthState {
//   user: User | null;
//   isLoggedIn: boolean;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   isLoggedIn: false,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     loginSuccess: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isLoggedIn = true;
//       state.loading = false;
//       state.error = null;
//     },
//     loginFailure: (state, action: PayloadAction<string>) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isLoggedIn = false;
//     },
//     updateUser: (state, action: PayloadAction<Partial<User>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//       }
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
// export default authSlice.reducer;
// upper wala chat ke liyi tha  , ab nichi only login ke liyi hai .


// store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: string;
  // add any other user fields you need
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;