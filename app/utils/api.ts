import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',  // 'http://<your-ip>:5000/api', // Replace with your backend IP
});

export default API;
