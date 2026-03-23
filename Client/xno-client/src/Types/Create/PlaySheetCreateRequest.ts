import type { PlaySheetSituationCreateRequest } from "./PlaySheetSituationCreateRequest";

export interface PlaySheetCreateRequest {
    playSheetName: string;
    playbookId: number;
    situations: PlaySheetSituationCreateRequest[];
}