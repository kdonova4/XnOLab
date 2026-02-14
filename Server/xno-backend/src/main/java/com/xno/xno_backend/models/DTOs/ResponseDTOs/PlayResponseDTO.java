package com.xno.xno_backend.models.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayResponseDTO {
    private Long playId;
    private String playName;
    private String playImageUrl;
    private String playNotes;
    private FormationResponseDTO formationResponse;
}
