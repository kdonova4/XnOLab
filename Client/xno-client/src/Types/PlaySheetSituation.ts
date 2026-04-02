import type { PlayResponse } from "./Response/PlayResponse";

export interface PlaySheetSituation {
    playSheetSituationId: number;
    situationName: string;
    situationColor: string;
    playSheetId: number;
    plays: PlayResponse[];
}