import type { PlayUpdateRequest } from "./PlayUpdateRequest";

export interface UpdatePlayInput {
    play: PlayUpdateRequest,
    file?: File
}