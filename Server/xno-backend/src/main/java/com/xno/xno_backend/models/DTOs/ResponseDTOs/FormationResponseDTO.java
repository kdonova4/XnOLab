package com.xno.xno_backend.models.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormationResponseDTO {
    private Long formationId;
    private String formationName;
    private String formationImageUrl;
}
