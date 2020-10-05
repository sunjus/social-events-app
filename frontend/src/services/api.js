import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.backendURL
});

export default api;
