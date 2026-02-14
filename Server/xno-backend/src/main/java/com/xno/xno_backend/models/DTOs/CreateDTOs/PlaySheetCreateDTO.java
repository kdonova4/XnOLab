package com.xno.xno_backend.models.DTOs.CreateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetCreateDTO {
    private String playSheetName;
    private Long playbookId;
    private List<PlaySheetSituationCreateDTO> situations;
}
