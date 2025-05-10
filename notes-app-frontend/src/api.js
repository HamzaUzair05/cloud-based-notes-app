import axios from "axios";

const API = axios.create({
  baseURL: "http://16.171.57.187:5000/", // or your deployed backend URL
});

export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
