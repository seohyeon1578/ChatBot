import axios from "axios";

const appServerAxios = axios.create({
  baseURL: "http://localhost:5001"
})

export default appServerAxios;