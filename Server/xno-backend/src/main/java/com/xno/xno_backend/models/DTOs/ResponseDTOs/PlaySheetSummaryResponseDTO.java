package com.xno.xno_backend.models.DTOs.ResponseDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaySheetSummaryResponseDTO {
    private Long playSheetId;
    private String playSheetName;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private PlaybookSummaryResponseDTO playbook;
}
