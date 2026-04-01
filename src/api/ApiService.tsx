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
            }
        )
    },

    async getDetails(id: string){
        return await api.sbdbApi.get(this.URL_SBDB + `?sstr=${id}&phys-par=true`)
            .then(response => {
                return response.data
            }
        )
    },

    async getVectors(id: string, date: string){
        return await api.horizonApi.get(this.URL_HORIZON +  `?format=text&COMMAND='DES=${id}%3B'&EPHEM_TYPE='VECTORS'&CENTER='@399'&OUT_UNITS='AU-D'&START_TIME='${date}'&STOP_TIME='2021-03-07'&STEP_SIZE='1d'&VEC_TABLE='1'&OBJ_DATA='NO'`)
            .then(response => {
                return response.data
            }
        )
    }



}

export default ApiService;