import axios from "axios";

const API = axios.create({
  baseURL: "http://3.90.27.118:5000/", // Replace with your actual EC2 public IP
});

export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
