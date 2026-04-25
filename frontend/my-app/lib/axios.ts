import axios from "axios";

const API = axios.create({
  baseURL: "https://resumeai-6699.onrender.com"
});

// // Token auto attach
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

export default API;