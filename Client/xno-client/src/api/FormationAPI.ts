import axios from "axios"
import type { FormationResponse } from "../types/Response/FormationResponse"
import { handleError } from "./ErrorHandler"
import { getAxiosConfig } from "./axiosConfig"
import type { CreateFormationInput } from "../types/Create/CreateFormationInput"
import type { UpdateFormationInput } from "../types/Update/UpdateFormationInput"

const url = `${import.meta.env.VITE_API_URL}/formations`

export const getFormationById = async (formationId: number): Promise<FormationResponse> => {
    try {
        const response = await axios.get(`${url}/formation/${formationId}`, getAxiosConfig());
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
}

export const getAllFormationsByUser = async (): Promise<FormationResponse[]> => {
    try {
        const response = await axios.get(`${url}/user`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const searchByFormationName = async (name: string): Promise<FormationResponse[]> => {
    try {
        const response = await axios.get(`${url}/search/${name}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const createFormation = async (input: CreateFormationInput): Promise<FormationResponse> => {
    const { formation, file } = input;
    
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("formationName", formation.formationName)

        const response = await axios.post(`${url}`, formData, {
            withCredentials: true
        })
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const updateFormation = async (input: UpdateFormationInput): Promise<FormationResponse> => {
    const { formation, file } = input;
    
    try {
        const formData = new FormData();
        if(file) {
            formData.append("file", file);
        }
        formData.append("formationId", formation.formationId.toString());
        formData.append("formationName", formation.formationName);

        const response = await axios.put(`${url}`, formData, {
            withCredentials: true
        })

        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const deleteFormation = async (formationId: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${formationId}`, getAxiosConfig());
    } catch (error: any) {
        throw handleError(error);
    }
}