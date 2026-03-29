import api from "./api";



const ApiService = {
    URL_NEO: import.meta.env.VITE_API_URL,
    URL_HORIZON: import.meta.env.VITE_API_VECTORS_URL,
    URL_SBDB: import.meta.env.VITE_API_DETAILS_URL,
    KEY: import.meta.env.VITE_API_KEY,


    async getExample(){
        return await api.neoApi.get(this.URL_NEO + `/feed?start_date=2021-03-06&end_date=2021-03-06&api_key=${this.KEY}`)
            .then(response => {
                return response.data
            })
    },

    async getDetails(id: string){
        return await api.sbdbApi.get(this.URL_SBDB + `?sstr=${id}&phys-par=true`)
            .then(response => {
                return response.data
            })
    },



}

export default ApiService;