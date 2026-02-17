package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;

import java.util.List;

public interface FormationService {

    List<FormationResponseDTO> getAllFormationsByUser(Long userId);

    List<FormationResponseDTO> searchByFormationName(String formationName);

    Result<FormationResponseDTO> createFormation(FormationCreateDTO formationCreateDTO);

    Result<FormationResponseDTO> updateFormation(FormationUpdateDTO formationUpdateDTO);

    void deleteFormation(Long formationId);
}
