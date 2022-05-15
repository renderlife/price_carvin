import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { CONFIG } from '../constants/config'

export default class API {
    static request = (
        url: string,
        method: Method = 'GET',
        data?: any
    ): Promise<AxiosResponse> => {
        const options: AxiosRequestConfig = {
            baseURL: CONFIG.API_ROOT,
            url,
            method,
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        }

        if (CONFIG.TOKEN) {
            options.headers = { ...options.headers, Authorization: `Bearer ${CONFIG.TOKEN}` }
        }

        return axios.request(options)
    }
}
