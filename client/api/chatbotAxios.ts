import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

const chatbotAxios = axios.create({
  baseURL: "http://localhost:5005"
})

chatbotAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access-token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  }
)

chatbotAxios.interceptors.response.use(
  (response) => { return response },
  async (error) => {
    const originalConfig = error.config;

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      
      try {
        const res = await axios.post(
          'http://localhost:5001/auth/refresh',
          {
            headers: {
              Authorization: getCookie('refresh-token')
            }
          }
        );

        const accessToken = res.data.data['access_token'];

        localStorage.setItem('access-token', accessToken);

        return chatbotAxios(originalConfig);
      } catch(error) {
        localStorage.removeItem('access-token');
        deleteCookie('refresh-token');
        return Promise.reject(error);
      }
    }
  }
)

export default chatbotAxios;