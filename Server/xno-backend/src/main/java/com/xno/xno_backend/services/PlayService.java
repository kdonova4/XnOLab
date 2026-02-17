package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;

import java.util.List;

public interface PlayService {

    List<PlayResponseDTO> searchPlaysByName(String name);

    List<PlayResponseDTO> getPlaysByPlaybook(Long playbookId);

    List<PlayResponseDTO> getPlaysByFormation(Long formationId);

    Result<PlayResponseDTO> createPlay(PlayCreateDTO play);

    Result<PlayResponseDTO> updatePlay(PlayUpdateDTO play, Long playId);

    void deletePlay(Long playId);
}
