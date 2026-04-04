import axios from "axios";
import type { PlaySheetSummaryResponse } from "../types/Response/PlaySheetSummaryResponse"
import { getAxiosConfig } from "./axiosConfig";
import type { PlaySheetDetailResponse } from "../types/Response/PlaySheetDetailResponse";
import type { PlaySheetCreateRequest } from "../types/Create/PlaySheetCreateRequest";
import type { PlaySheetUpdateRequest } from "../types/Update/PlaySheetUpdateRequest";
import { handleError } from "./ErrorHandler";
import type { GenerateRequest } from "../types/Misc/GenerateRequest";

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
        const response = await axios.get(`${url}/playsheet/details/${playSheetId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaySheetSummaryById = async (playSheetId: number): Promise<PlaySheetSummaryResponse> => {
    try {
        const response = await axios.get(`${url}/playsheet/summary/${playSheetId}`, getAxiosConfig());
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

export const generatePlaySheet = async (generateRequest: GenerateRequest): Promise<{ blob: Blob; filename: string}> => {
    const { playSheetId, generationDetails } = generateRequest;
    
    try {
        const response = await axios.post(`${url}/download/${playSheetId}`, generationDetails, {
            ...getAxiosConfig(),
            responseType: 'blob',
            validateStatus: (status) => status < 500, // treat 400 as success to read JSON
        });

        // If response is actually JSON (error), parse it
        if (response.data.type === 'application/json') {
            const text = await response.data.text();
            const parsed = JSON.parse(text);
            throw new Error(Array.isArray(parsed) ? parsed[0] : parsed.message || 'Something went wrong');
        }

        // Try to get filename from Content-Disposition header
    const disposition = response.headers['content-disposition'];
    let filename = 'playsheet.pdf'; // default
    if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
            filename = match[1];
        }
    }

    return { blob: response.data, filename };
    } catch (error: any) {
        throw new Error(error.message || 'Something went wrong');
    }
};
export const deletePlaySheet = async (playSheetId: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${playSheetId}`, getAxiosConfig());
    } catch (error: any) {
        throw handleError(error);
    }
}