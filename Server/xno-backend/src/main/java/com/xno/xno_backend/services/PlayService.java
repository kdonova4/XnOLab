package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PlayService {

    List<PlayResponseDTO> searchPlaysByName(String name, Long userId);

    List<PlayResponseDTO> getPlaysByPlaybook(Long playbookId, Long userId);

    List<PlayResponseDTO> getPlaysByFormation(Long formationId, Long userId);

    Result<PlayResponseDTO> createPlay(PlayCreateDTO play, MultipartFile file, Long userId);

    Result<PlayResponseDTO> updatePlay(PlayUpdateDTO play, MultipartFile file, Long userId);

    void deletePlay(Long playId, Long userId);
}
