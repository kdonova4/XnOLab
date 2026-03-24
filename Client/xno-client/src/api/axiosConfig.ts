import type { AxiosRequestConfig } from "axios";

export const getAxiosConfig = (): AxiosRequestConfig => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }
}