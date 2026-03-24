import axios from "axios"
import type { LoginRequest } from "../types/Auth/LoginRequest"
import type { UserInfoResponse } from "../types/Auth/UserInfoResponse"
import type { SignUpRequest } from "../types/Auth/SignUpRequest"
import type { MessageResponse } from "../types/Response/MessageResponse"
import { getAxiosConfig } from "./axiosConfig"
import { handleError } from "./errorHandler"

const url = `${import.meta.env.VITE_API_URL}/auth`

export const login = async (credentials: LoginRequest): Promise<UserInfoResponse> => {

    try {
        const response = await axios.post(`${url}/login`, credentials,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const register = async (credentials: SignUpRequest): Promise<MessageResponse> => {
    try {
        const response = await axios.post(`${url}/sign-up`, credentials, getAxiosConfig())
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getUsername = async (): Promise<String> => {
    try {
        const response = await axios.get(`${url}/username`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getUserDetails = async (): Promise<UserInfoResponse> => {
    try {
        const response = await axios.get(`${url}/user`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}