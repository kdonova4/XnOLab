package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;

import java.util.List;

public interface PlaybookService {

    PlaybookDetailResponseDTO getPlaybookDetails(Long playbookId);

    List<PlaybookSummaryResponseDTO> getAllPlaybooksByUser(Long userId);

    Result<PlaybookSummaryResponseDTO> createPlaybook(PlaybookCreateDTO playbookCreateDTO, Long userId);

    Result<PlaybookSummaryResponseDTO> updatePlaybook(PlaybookUpdateDTO playbookUpdateDTO, Long userId);

    void deletePlaybook(Long playbookId);
}
