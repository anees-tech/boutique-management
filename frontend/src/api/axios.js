import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong"
    console.error("API Error:", message)
    return Promise.reject(error)
  },
)

export default api
