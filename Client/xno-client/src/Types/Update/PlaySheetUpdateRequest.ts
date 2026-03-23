import type { PlaySheetSituationUpdateRequest } from "./PlaySheetSituationUpdateRequest";

export interface PlaySheetUpdateRequest {
    playSheetId: number;
    playSheetName: string;
    situations: PlaySheetSituationUpdateRequest[];
}