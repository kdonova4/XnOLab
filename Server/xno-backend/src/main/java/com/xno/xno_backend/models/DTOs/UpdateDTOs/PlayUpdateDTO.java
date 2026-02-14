package com.xno.xno_backend.models.DTOs.UpdateDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayUpdateDTO {
    private String playName;
    private String playNotes;
}
