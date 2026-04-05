import type { newDate } from "react-datepicker/dist/dist/date_utils.js";
import api from "./api";



const ApiService = {
    URL_NEO: import.meta.env.VITE_API_URL,
    URL_HORIZON: import.meta.env.VITE_API_VECTORS_URL,
    URL_SBDB: import.meta.env.VITE_API_DETAILS_URL,
    KEY: import.meta.env.VITE_API_KEY,


    async getAsteroids(startDate: Date, endDate: Date){
        return await api.neoApi.get(this.URL_NEO + `/feed?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&api_key=${this.KEY}`)
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
        const [year, month, day] = date.split("-");
        const nextDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        nextDate.setDate(nextDate.getDate() + 2);
        console.log(date);
        console.log(nextDate.toISOString().split('T')[0]);
        return await api.horizonApi.get(this.URL_HORIZON +  `?format=text&COMMAND='DES=${id}%3B'&EPHEM_TYPE='VECTORS'&CENTER='@399'&OUT_UNITS='AU-D'&START_TIME='${date}'&STOP_TIME='${nextDate.toISOString().split('T')[0]}'&STEP_SIZE='1d'&VEC_TABLE='1'&OBJ_DATA='NO'`)
            .then(response => {
                return response.data
            }
        )
    }



}

export default ApiService;