import type { FormationResponse } from "./FormationResponse";
import type { PlaybookSummaryResponse } from "./PlaybookSummaryResponse";

export interface PlayResponse {
    playId: number;
    playName: string;
    playImageUrl: string;
    playNotes: string;
    formationResponse: FormationResponse
    playbookResponse: PlaybookSummaryResponse
}