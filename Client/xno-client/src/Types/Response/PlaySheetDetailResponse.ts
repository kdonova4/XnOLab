import type { PlaybookSummaryResponse } from "./PlaybookSummaryResponse";
import type { PlaySheetSituationResponse } from "./PlaySheetSituationResponse";

export interface PlaySheetDetailResponse {
    playSheetId: number;
    playSheetName: string;
    createdAt: string;
    updatedAt: string;
    playbook: PlaybookSummaryResponse
    situations: PlaySheetSituationResponse[]
}