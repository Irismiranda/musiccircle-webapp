import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://localhost:4000',
})

export { Axios }