import type { PlayResponse } from "./PlayResponse";

export interface PlaybookDetailResponse {
    playbookId: number;
    playbookName: string;
    plays: PlayResponse[]
}