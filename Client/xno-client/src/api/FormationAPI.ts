import axios from "axios"
import type { FormationResponse } from "../types/Response/FormationResponse"
import { handleError } from "./errorHandler"
import { getAxiosConfig } from "./axiosConfig"
import type { FormationCreateRequest } from "../types/Create/FormationCreateRequest"
import type { FormationUpdateRequest } from "../types/Update/FormationUpdateRequest"

const url = `${import.meta.env.VITE_API_URL}/formations`

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

export const createFormation = async (formation: FormationCreateRequest, file: File): Promise<FormationResponse> => {
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

export const updateFormation = async (formation: FormationUpdateRequest, file: File): Promise<FormationResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
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