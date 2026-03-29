import axios from 'axios';


const neoApi = axios.create({
    method: "post",
    baseURL: import.meta.env.VITE_API_URL,
})

const horizonApi = axios.create({
    method: "post",
    baseURL: import.meta.env.VITE_API_VECTORS_URL,
})

const sbdbApi = axios.create({
    method: "post",
    baseURL: import.meta.env.VITE_API_DETAILS_URL,
})

const api = {
    neoApi,
    horizonApi,
    sbdbApi,
}

export default api;  