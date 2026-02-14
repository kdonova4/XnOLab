package com.xno.xno_backend.models.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetSituationResponseDTO {
    private Long playSheetSituationId;
    private String situationName;
    private String situationColor;
    private Long playSheetId;
    private List<PlaySheetSituationPlayResponseDTO> plays;
}
