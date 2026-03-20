import type { FormationResponse } from "./FormationResponse";

export interface PlayResponse {
    playId: number;
    playName: string;
    playImageUrl: string;
    playNotes: string;
    formationResponse: FormationResponse
}