export interface PlaySheetSituationCreateRequest {
    situationName: string;
    situationColor: string;
    playSheetId: number;
    playIds: number[];
}