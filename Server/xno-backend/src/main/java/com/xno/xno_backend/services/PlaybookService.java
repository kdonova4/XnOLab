package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;

import java.util.List;

public interface PlaybookService {

    List<PlaybookSummaryResponseDTO> getAllPlaybooksByUser(Long userId);

    PlaybookSummaryResponseDTO createPlaybook(PlaybookCreateDTO playbookCreateDTO);

    PlaybookSummaryResponseDTO updatePlaybook(PlaybookUpdateDTO playbookUpdateDTO);

    void deletePlaybook(Long playbookId);
}
