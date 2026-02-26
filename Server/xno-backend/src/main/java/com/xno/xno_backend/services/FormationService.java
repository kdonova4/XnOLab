package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FormationService {

    List<FormationResponseDTO> getAllFormationsByUser(Long userId);

    List<FormationResponseDTO> searchByFormationName(String formationName, Long userId);

    Result<FormationResponseDTO> createFormation(FormationCreateDTO formationCreateDTO, MultipartFile file, Long userId);

    Result<FormationResponseDTO> updateFormation(FormationUpdateDTO formationUpdateDTO, MultipartFile file, Long userId);

    void deleteFormation(Long formationId, Long userId);
}
