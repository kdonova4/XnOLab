package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;
import com.xno.xno_backend.repositories.PlaybookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaybookServiceImpl implements PlaybookService{

    private final PlaybookRepository playbookRepository;

    public PlaybookServiceImpl(PlaybookRepository playbookRepository) {
        this.playbookRepository = playbookRepository;
    }

    @Override
    public List<PlaybookSummaryResponseDTO> getAllPlaybooksByUser(Long userId) {
        return List.of();
    }

    @Override
    public Result<PlaybookSummaryResponseDTO> createPlaybook(PlaybookCreateDTO playbookCreateDTO) {
        return null;
    }

    @Override
    public Result<PlaybookSummaryResponseDTO> updatePlaybook(PlaybookUpdateDTO playbookUpdateDTO) {
        return null;
    }

    @Override
    public void deletePlaybook(Long playbookId) {

    }
}
