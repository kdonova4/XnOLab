package com.xno.xno_backend.models.DTOs.CreateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayCreateDTO {
    private String playName;
    private String playNotes;
    private Long formationId;
    private Long playbookId;
}
