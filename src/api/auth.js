import axios from "axios";
axios.defaults.withCredentials = true;
// axios.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });
const API = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export const registerUser = async ( userData) => {
    return await axios.post( `${API}/register`, userData );
};
export const loginUser = async ( userData ) => {
    return await axios.post( `${API}/login`, userData );
};
export const getMe = async () => {
    return await axios.get(`${API}/me`);
};
export const logoutUser = async () => {
    return await axios.post(`${API}/logout`);
};