import axios from "axios"
import type { LoginRequest } from "../types/Auth/LoginRequest"
import type { UserInfoResponse } from "../types/Auth/UserInfoResponse"

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
        if(error.response?.data) {
            const message = error.response.data[0] ||
            "Login Failed";

            throw new Error(message);
        }

        throw new Error("Login Failed");
    }


}