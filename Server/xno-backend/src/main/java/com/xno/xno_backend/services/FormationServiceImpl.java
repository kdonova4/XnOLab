package com.xno.xno_backend.services;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class FormationServiceImpl implements FormationService{

    private final FormationRepository formationRepository;
    private final AppUserRepository appUserRepository;
    private final CloudinaryImageService imageService;

    public FormationServiceImpl(FormationRepository formationRepository, AppUserRepository appUserRepository, CloudinaryImageService imageService) {
        this.formationRepository = formationRepository;
        this.appUserRepository = appUserRepository;
        this.imageService = imageService;
    }

    @Override
    public List<FormationResponseDTO> getAllFormationsByUser(Long userId) {
        List<Formation> formations = formationRepository.findByUser_AppUserId(userId);

        // REFACTOR TO A DEDICATED MAPPER CLASS!!!!!!!!
        List<FormationResponseDTO> formationResponseDTOS = formations.stream()
                .map(formation -> new FormationResponseDTO(
                        formation.getFormationId(),
                        formation.getFormationName(),
                        formation.getFormationImageUrl()
                )).toList();

        return formationResponseDTOS;
    }

    @Override
    public List<FormationResponseDTO> searchByFormationName(String formationName) {
        List<Formation> formations = formationRepository.findByFormationNameContainingIgnoreCaseAndUser_AppUserId(formationName, 1L);

        // REFACTOR TO A DEDICATED MAPPER CLASS!!!!!!!!
        List<FormationResponseDTO> formationResponseDTOS = formations.stream()
                .map(formation -> new FormationResponseDTO(
                        formation.getFormationId(),
                        formation.getFormationName(),
                        formation.getFormationImageUrl()
                )).toList();

        return formationResponseDTOS;
    }

    @Override
    public Result<FormationResponseDTO> createFormation(FormationCreateDTO formationCreateDTO, MultipartFile file, Long userId) {
        Result<FormationResponseDTO> result = validateCreate(formationCreateDTO, file, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Map uploadResult = imageService.uploadImage(file);
        String formationUrl = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();

        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        Formation formation = new Formation(formationCreateDTO.getFormationName(), formationUrl, publicId,  appUser);

        Formation savedFormation = formationRepository.save(formation);

        // REFACTOR TO A DEDICATED MAPPER CLASS!!!!!!!!
        FormationResponseDTO response = new FormationResponseDTO(savedFormation.getFormationId(), savedFormation.getFormationName(), savedFormation.getFormationImageUrl());
        result.setPayload(response);

        return result;
    }

    @Override
    public Result<FormationResponseDTO> updateFormation(FormationUpdateDTO formationUpdateDTO, MultipartFile file, Long userId) {
        return null;
    }

    @Override
    public void deleteFormation(Long formationId) {
        formationRepository.deleteById(formationId);
    }

    private Result<FormationResponseDTO> validateCreate(FormationCreateDTO formationCreateDTO, MultipartFile file, Long userId) {
        Result<FormationResponseDTO> result = new Result<>();

        if(formationCreateDTO == null) {
            result.addMessages("Formation cannot be null", ResultType.INVALID);
            return result;
        }

        if(userId == null || !appUserRepository.existsById(userId)) {
            result.addMessages("User must exist", ResultType.INVALID);
            return result;
        }

        if(file == null) {
            result.addMessages("Image cannot be null", ResultType.INVALID);
            return result;
        }

        if(file.isEmpty()) {
            result.addMessages("Image file is empty", ResultType.INVALID);
        }

        String name = formationCreateDTO.getFormationName();
        if(name == null || name.isBlank()) {
            result.addMessages("Formation Name cannot be blank or empty", ResultType.INVALID);
        }

        List<Formation> userFormations = formationRepository.findByUser_AppUserId(userId);

        userFormations.stream().forEach(formation -> {
            if(formation.getFormationName().equals(formationCreateDTO.getFormationName())) {
                result.addMessages("Formation Name cannot be the same as another user formation", ResultType.INVALID);
            }
        });

        return result;
    }

    private Result<FormationResponseDTO> validateUpdate(FormationUpdateDTO formationUpdateDTO, MultipartFile file, Long userId) {
        Result<FormationResponseDTO> result = new Result<>();

        if(formationUpdateDTO == null) {
            result.addMessages("Formation Update cannot be null", ResultType.INVALID);
            return result;
        }

        if(userId == null || !appUserRepository.existsById(userId)) {
            result.addMessages("User must exist", ResultType.INVALID);
            return result;
        }

        if(formationUpdateDTO.getFormationId() == null || !formationRepository.existsById(formationUpdateDTO.getFormationId())) {
            result.addMessages("Formation must exist with same ID", ResultType.INVALID);
            return result;
        }

        String name = formationUpdateDTO.getFormationName();
        if(name == null || name.isBlank()) {
            result.addMessages("Formation Name cannot be blank or empty", ResultType.INVALID);
        }

        List<Formation> userFormations = formationRepository.findByUser_AppUserId(userId);

        userFormations.stream().forEach(formation -> {
            if(!formation.getFormationId().equals(formationUpdateDTO.getFormationId()) && formation.getFormationName().equals(formationUpdateDTO.getFormationName())) {
                result.addMessages("Formation Name cannot be the same as another user formation", ResultType.INVALID);
            }
        });

        Formation formation = formationRepository.findById(formationUpdateDTO.getFormationId()).get();
        if(!formation.getPlays().isEmpty() && file != null) {
            result.addMessages("Cannot edit formation image in use by plays", ResultType.INVALID);
        }

        return result;
    }
}
