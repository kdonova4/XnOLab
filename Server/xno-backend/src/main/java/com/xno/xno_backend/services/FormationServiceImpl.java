package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.repositories.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationServiceImpl implements FormationService{

    private final FormationRepository formationRepository;

    public FormationServiceImpl(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    @Override
    public List<FormationResponseDTO> getAllFormationsByUser(Long userId) {
        List<Formation> formations = formationRepository.findByUser_AppUserId(userId);

        // REFACTOR TO A DEDICATED MAPPER CLASS!!!!!!!!
        List<FormationResponseDTO> formationResponseDTOS = formations.stream()
                .map(formation -> {

                    return new FormationResponseDTO(
                            formation.getFormationId(),
                            formation.getFormationName(),
                            formation.getFormationImageUrl()
                    );
                }).toList();

        return formationResponseDTOS;
    }

    @Override
    public List<FormationResponseDTO> searchByFormationName(String formationName) {
        return List.of();
    }

    @Override
    public Result<FormationResponseDTO> createFormation(FormationCreateDTO formationCreateDTO) {
        return null;
    }

    @Override
    public Result<FormationResponseDTO> updateFormation(FormationUpdateDTO formationUpdateDTO) {
        return null;
    }

    @Override
    public void deleteFormation(Long formationId) {

    }
}
