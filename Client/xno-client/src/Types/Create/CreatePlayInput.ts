import type { PlayCreateRequest } from "./PlayCreateRequest";

export interface CreatePlayInput {
    play: PlayCreateRequest;
    file: File
}