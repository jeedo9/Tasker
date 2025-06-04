import axios from "axios";

const {VITE_BASE_URL: BASE_URL} = import.meta.env

const api = axios.create({
    baseURL: BASE_URL
})

export default api