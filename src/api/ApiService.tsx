import api from "./api";



const ApiService = {
    URL: import.meta.env.VITE_API_URL,
    KEY: import.meta.env.VITE_API_KEY,

    async getHello(){
        return await api.get(this.URL + `/dwarf`)
            .then(response => {
                return response.data
            })
    },

    async getExample(){
        return await api.get(this.URL + `/feed?start_date=2017-09-01&end_date=2017-09-08&api_key=${this.KEY}`)
            .then(response => {
                return response.data
            })
    },



    // async login(email: string, password: string){
    //     return await api.post(this.URL + '/auth/login',{},{})
    //         .then(response => {
    //             return response
    //         })
    // },

    // async signup(email: string, password: string, username: string){
    //     return await api.post(this.URL + '/auth/register',{
    //         "email": email,
    //         "password": password,
    //         "name": username,
    //     },{})
    //         .then(response => {
    //             //ustawia token w kontekście użytkownika
    //             return response
    //         })
    // },

    // async sendPhoto(base64Image: string, lat: number, lng: number){
    //     return await api.post(this.URL + '/user-dwarf/nearest',{
    //         "base64Image": base64Image,
    //         "lat": lat,
    //         "lng": lng,
    //     },{})
    //         .then(response => {
    //             return response
    //     })
    // }
}

export default ApiService;