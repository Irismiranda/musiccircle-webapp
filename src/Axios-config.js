import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://musiccircle-api.onrender.com',
  withCredentials: true,
})

export { Axios }