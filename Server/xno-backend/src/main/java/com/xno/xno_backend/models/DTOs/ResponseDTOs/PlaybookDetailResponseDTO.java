package com.xno.xno_backend.models.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaybookDetailResponseDTO {
    private Long playbookId;
    private String playbookName;
    private List<PlayResponseDTO> plays;
}
