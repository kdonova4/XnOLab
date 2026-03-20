import type { PlaySheetSituationPlayResponse } from "./PlaySheetSituationPlayResponse";

export interface PlaySheetSituationResponse {
    playSheetSituationId: number;
    situationName: string;
    situationColor: string;
    playSheetId: number;
    plays: PlaySheetSituationPlayResponse[]
}