import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:4001/api",
  withCredentials: true, // keep; harmless even if we use JWT header
})

// Attach Authorization: Bearer <token> if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
