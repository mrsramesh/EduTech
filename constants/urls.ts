// export const AUTH_URL = {
//     REGISTER: "/api/auth/register",
//     LOGIN: "/api/auth/login",
//     PROFILE: "/api/auth/profile"
//   };

const BASE_URL =   'http://192.168.3.136:5000/api'//'http://localhost:5000/api';

export const AUTH_URL = {
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  UPDATE_PROFILE: `${BASE_URL}/auth/update-profile`,
};