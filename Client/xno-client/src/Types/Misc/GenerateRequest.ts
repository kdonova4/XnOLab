import type { GenerationDetails } from "./GenerationDetails";

export interface GenerateRequest {
    playSheetId: number;
    generationDetails: GenerationDetails
}