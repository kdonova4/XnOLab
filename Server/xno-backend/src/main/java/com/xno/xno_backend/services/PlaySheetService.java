package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;

import java.util.List;

public interface PlaySheetService {

    List<PlaySheetSummaryResponseDTO> searchPlaySheetByName(String name);

    List<PlaySheetSummaryResponseDTO> getPlaySheetByUser(Long userId);

    List<PlaySheetSummaryResponseDTO> getPlaySheetByPlaybook(Long playbookId);

    Result<PlaySheetSummaryResponseDTO> createPlaySheet(PlaySheetCreateDTO playSheetCreateDTO);

    Result<PlaySheetSummaryResponseDTO> updatePlaySheet(PlaySheetUpdateDTO playSheetUpdateDTO, Long playSheetId);

    void deletePlaySheet(Long playSheetId);
}
