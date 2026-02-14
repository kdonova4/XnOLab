package com.xno.xno_backend.models.DTOs.UpdateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetUpdateDTO {
    private String playSheetName;
    private List<PlaySheetSituationUpdateDTO> situations;
}
