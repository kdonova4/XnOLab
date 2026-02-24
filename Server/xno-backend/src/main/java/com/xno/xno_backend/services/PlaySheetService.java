package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;

import java.util.List;

public interface PlaySheetService {

    PlaySheetSummaryResponseDTO getPlaySheetSummaryById(Long playSheetId, Long userId);

    PlaySheetDetailResponseDTO loadPlaySheetDetailsById(Long playSheetId, Long userId);

    List<PlaySheetSummaryResponseDTO> searchPlaySheetByName(String name, Long userId);

    List<PlaySheetSummaryResponseDTO> getPlaySheetByUser(Long userId);

    List<PlaySheetSummaryResponseDTO> getPlaySheetByPlaybook(Long playbookId, Long userId);

    Result<PlaySheetSummaryResponseDTO> createPlaySheet(PlaySheetCreateDTO playSheetCreateDTO, Long userId);

    Result<PlaySheetSummaryResponseDTO> updatePlaySheet(PlaySheetUpdateDTO playSheetUpdateDTO, Long playSheetId, Long userId);

    void deletePlaySheet(Long playSheetId, Long userId);
}
