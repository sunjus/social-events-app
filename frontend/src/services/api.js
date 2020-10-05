import axios from "axios";

const api = axios.create({
  baseURL: "http://s2.pal9.cyou:8000",
});

export default api;
