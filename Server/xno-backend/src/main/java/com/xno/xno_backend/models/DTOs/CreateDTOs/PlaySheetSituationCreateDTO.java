package com.xno.xno_backend.models.DTOs.CreateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetSituationCreateDTO {
    private String situationName;
    private String situationColor;
    private Long playSheetId;
    private List<Long> playIds;
}
