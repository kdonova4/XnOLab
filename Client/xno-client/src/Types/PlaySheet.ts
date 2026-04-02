import type { PlaySheetSituation } from "./PlaySheetSituation";

export interface PlaySheet {
    playSheetId: number;
    playSheetName: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    playbookId: number;
    situations: PlaySheetSituation[];
}