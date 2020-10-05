import eventFilters from "./eventFilters";
export default {
  eventFilters,
  backendURL: process.env.REACT_APP_BACKEND_URI || "http://localhost:8000/api"
};
