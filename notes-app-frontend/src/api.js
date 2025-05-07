import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Your Flask backend URL
});

export const setToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;
