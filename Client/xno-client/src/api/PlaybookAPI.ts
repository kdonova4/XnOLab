import axios from "axios"
import type { PlaybookDetailResponse } from "../types/Response/PlaybookDetailResponse"
import { handleError } from "./ErrorHandler"
import type { PlaybookSummaryResponse } from "../types/Response/PlaybookSummaryResponse"
import { getAxiosConfig } from "./axiosConfig"
import type { PlaybookCreateRequest } from "../types/Create/PlaybookCreateRequest"
import type { PlaybookUpdateRequest } from "../types/Update/PlaybookUpdateRequest"

const url = `${import.meta.env.VITE_API_URL}/playbooks`

export const getPlaybookSummaryById = async (playbookId: number): Promise<PlaybookSummaryResponse> => {
    try {
        const response = await axios.get(`${url}/playbook/summary/${playbookId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaybookDetails = async (playbookId: number): Promise<PlaybookDetailResponse> => {
    try {
        const response = await axios.get(`${url}/details/${playbookId}`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const getPlaybooksByUser = async (): Promise<PlaybookSummaryResponse[]> => {
    try {
        const response = await axios.get(`${url}/user`, getAxiosConfig());
        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const createPlaybook = async (playbook: PlaybookCreateRequest): Promise<PlaybookSummaryResponse> => {
    try {
        const response = await axios.post(`${url}`, playbook, getAxiosConfig());

        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const updatePlaybook = async (playbook: PlaybookUpdateRequest): Promise<PlaybookSummaryResponse> => {
    try {
        const response = await axios.put(`${url}`, playbook, getAxiosConfig());

        return response.data;
    } catch (error: any) {
        throw handleError(error);
    }
}

export const deletePlaybook = async (playbookId: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${playbookId}`, getAxiosConfig());
    } catch (error: any) {
        throw handleError(error);
    }
}