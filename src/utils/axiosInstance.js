import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "/";

const instance = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

export default instance;
