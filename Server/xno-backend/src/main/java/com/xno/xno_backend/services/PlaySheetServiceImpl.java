package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaySheetServiceImpl implements PlaySheetService {

    private final PlaySheetRepository playSheetRepository;

    public PlaySheetServiceImpl(PlaySheetRepository playSheetRepository) {
        this.playSheetRepository = playSheetRepository;
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> searchPlaySheetByName(String name) {
        return List.of();
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByUser(Long userId) {
        return List.of();
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByPlaybook(Long playbookId) {
        return List.of();
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> createPlaySheet(PlaySheetCreateDTO playSheetCreateDTO) {
        return null;
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> updatePlaySheet(PlaySheetUpdateDTO playSheetUpdateDTO, Long playSheetId) {
        return null;
    }

    @Override
    public void deletePlaySheet(Long playSheetId) {

    }
}
