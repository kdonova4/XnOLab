import type { PlaybookSummaryResponse } from "./PlaybookSummaryResponse";

export interface PlaySheetSummaryResponse {
    playSheetId: number;
    playSheetName: string;
    createdAt: string;
    updatedAt: string;
    playbook: PlaybookSummaryResponse;
}