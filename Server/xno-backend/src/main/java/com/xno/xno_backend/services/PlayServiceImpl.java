package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.repositories.PlayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayServiceImpl implements PlayService {

    private final PlayRepository playRepository;

    public PlayServiceImpl(PlayRepository playRepository) {
        this.playRepository = playRepository;
    }

    @Override
    public List<PlayResponseDTO> searchPlaysByName(String name) {
        return List.of();
    }

    @Override
    public List<PlayResponseDTO> getPlaysByPlaybook(Long playbookId) {
        return List.of();
    }

    @Override
    public List<PlayResponseDTO> getPlaysByFormation(Long formationId) {
        return List.of();
    }

    @Override
    public Result<PlayResponseDTO> createPlay(PlayCreateDTO play) {
        return null;
    }

    @Override
    public Result<PlayResponseDTO> updatePlay(PlayUpdateDTO play, Long playId) {
        return null;
    }

    @Override
    public void deletePlay(Long playId) {

    }
}
