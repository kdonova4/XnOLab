import axios from "axios";
import type { PlaySheetSummaryResponse } from "../types/Response/PlaySheetSummaryResponse"
import { getAxiosConfig } from "./axiosConfig";
import { handleError } from "./errorHandler";
import type { PlaySheetDetailResponse } from "../types/Response/PlaySheetDetailResponse";
import type { PlaySheetCreateRequest } from "../types/Create/PlaySheetCreateRequest";
import type { PlaySheetUpdateRequest } from "../types/Update/PlaySheetUpdateRequest";
import type { GenerationDetails } from "../types/Misc/GenerationDetails";

const url = `${import.meta.env.VITE_API_URL}/playsheets`

export const getPlaySheetsByUser = async (): Promise<PlaySheetSummaryResponse[]> => {
    try {
        const response = await axios.get(`${url}/user`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaySheetsByPlaybook = async (playbookId: number): Promise<PlaySheetSummaryResponse[]> => {
    try {
        const response = await axios.get(`${url}/playbook/${playbookId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const searchByPlaySheetName = async (playSheetName: string): Promise<PlaySheetSummaryResponse[]> => {
    try {
        const response = await axios.get(`${url}/search/${playSheetName}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaySheetDetailsById = async (playSheetId: number): Promise<PlaySheetDetailResponse> => {
    try {
        const response = await axios.get(`${url}/details/${playSheetId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaySheetSummaryById = async (playSheetId: number): Promise<PlaySheetSummaryResponse> => {
    try {
        const response = await axios.get(`${url}/summary/${playSheetId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const createPlaySheet = async (playSheet: PlaySheetCreateRequest): Promise<PlaySheetSummaryResponse> => {
    try {
        const response = await axios.post(`${url}`, playSheet, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const updatePlaySheet = async (playSheet: PlaySheetUpdateRequest): Promise<PlaySheetSummaryResponse> => {
    try {
        const response = await axios.put(`${url}`, playSheet, getAxiosConfig())   ;
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const generatePlaySheet = async (playSheetId: number, generationDetails: GenerationDetails): Promise<Blob> => {
    try {
        const response = await axios.post(`${url}/download/${playSheetId}`, generationDetails, {
            ...getAxiosConfig(),
            responseType: "blob"
        });
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const deletePlaySheet = async (playSheetId: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${playSheetId}`, getAxiosConfig());
    } catch (error: any) {
        throw handleError(error);
    }
}