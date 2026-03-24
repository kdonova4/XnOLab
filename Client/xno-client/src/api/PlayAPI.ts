import axios from "axios"
import type { PlayResponse } from "../types/Response/PlayResponse"
import { handleError } from "./errorHandler"
import { getAxiosConfig } from "./axiosConfig"
import type { PlayCreateRequest } from "../types/Create/PlayCreateRequest"
import type { PlayUpdateRequest } from "../types/Update/PlayUpdateRequest"
import type { CopyRequest } from "../types/Misc/CopyRequest"

const url = `${import.meta.env.VITE_API_URL}/plays`

export const searchPlaysByName = async (name: string): Promise<PlayResponse[]> => {
    try {
        const response = await axios.get(`${url}/search/${name}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaysByPlaybook = async (playbookId: number): Promise<PlayResponse[]> => {
    try {
        const response = await axios.get(`${url}/playbook/${playbookId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaysByFormation = async (formationId: number): Promise<PlayResponse[]> => {
    try {
        const response = await axios.get(`${url}/formation/${formationId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const createPlay = async (play: PlayCreateRequest, file: File): Promise<PlayResponse> => {
    try {
        const formData = new FormData();
        formData.append("playName", play.playName)
        formData.append("playNotes", play.playNotes)
        formData.append("formationId", play.formationId.toString())
        formData.append("playbookId", play.playbookId.toString());
        formData.append("file", file)

        const response = await axios.post(`${url}`, formData, {
            withCredentials: true
        })

        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const updatePlay = async (play: PlayUpdateRequest, file: File): Promise<PlayResponse> => {
    try {
     const formData = new FormData();
     formData.append("playName", play.playName);
     formData.append("playNotes", play.playNotes);
     formData.append("playId", play.playId.toString());
     formData.append("file", file);

     const response = await axios.put(`${url}`, formData, {
        withCredentials: true
     })

     return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const copyPlays = async (copyRequest: CopyRequest): Promise<PlayResponse[]> => {
    try {
        const response = await axios.post(`${url}/copy`, copyRequest, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const deletePlay = async (playId: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${playId}`, getAxiosConfig());
    } catch (error: any) {
        throw handleError(error);
    }
}

