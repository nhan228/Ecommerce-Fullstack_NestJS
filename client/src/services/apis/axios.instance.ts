import axios from "axios";

(axios as any ).defaults.headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "locales": localStorage.getItem("locales") ?? "en",
  "token": String(localStorage.getItem("token"))
};

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default axios