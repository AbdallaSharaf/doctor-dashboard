import axios from "axios";

const instance = axios.create({
    baseURL: 'https://doctor-template-91160-default-rtdb.firebaseio.com/'
})

export default instance