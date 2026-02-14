package com.xno.xno_backend.models.DTOs.UpdateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetSituationUpdateDTO {
    private Long playSheetSituationId;
    private String situationName;
    private String situationColor;
    private List<Long> playIds;
}
