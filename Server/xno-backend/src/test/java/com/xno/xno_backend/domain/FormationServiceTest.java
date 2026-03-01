package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
import com.xno.xno_backend.services.CloudinaryImageService;
import com.xno.xno_backend.services.FormationServiceImpl;
import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

@ExtendWith(MockitoExtension.class)
public class FormationServiceTest {

    @Mock
    FormationRepository formationRepository;

    @Mock
    AppUserRepository appUserRepository;

    @Mock
    CloudinaryImageService imageService;

    @InjectMocks
    FormationServiceImpl formationService;

    private AppUser appUser;
    private AppRole appRole;
    private Formation formation;
    private FormationCreateDTO formationCreateDTO;
    private FormationResponseDTO formationResponseDTO;
    MultipartFile file;
    Map uploadResult;

    @BeforeEach
    void setup() {
        appRole = new AppRole(1L, Role.ROLE_USER);
        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "password1234", false, Set.of(appRole));
        formation = new Formation(1L, "formation1", "url", "id", appUser, new ArrayList<>());
        formationCreateDTO = new FormationCreateDTO("formation1");
        formationResponseDTO = new FormationResponseDTO(formation.getFormationId(), formation.getFormationName(), formation.getFormationImageUrl());

        file = new MockMultipartFile(
                "File",
                "test-image.png",
                "image/png",
                "dummy content".getBytes()
        );
        uploadResult = new HashMap();
        uploadResult.put("secure_url", "url1");
        uploadResult.put("public_id", "id");
    }

    @Test
    void shouldGetFormationsByUser() {
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(
                List.of(formation)
        );

        List<FormationResponseDTO> actual = formationService.getAllFormationsByUser(appUser.getAppUserId());

        assertEquals(1, actual.size());
        assertEquals("formation1", actual.getFirst().getFormationName());
        verify(formationRepository).findByUser_AppUserId(appUser.getAppUserId());
    }

    @Test
    void shouldSearchFormationsByName() {
        when(formationRepository.findByFormationNameContainingIgnoreCaseAndUser_AppUserId("form", appUser.getAppUserId())).thenReturn(
                List.of(formation)
        );

        List<FormationResponseDTO> actual = formationService.searchByFormationName("form", appUser.getAppUserId());

        assertEquals(1, actual.size());
        assertEquals("formation1", actual.getFirst().getFormationName());
        verify(formationRepository).findByFormationNameContainingIgnoreCaseAndUser_AppUserId("form", appUser.getAppUserId());
    }

    @Test
    void shouldCreateValidFormation() {
        when(imageService.uploadImage(file)).thenReturn(uploadResult);

        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.of(appUser));
        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(true);
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(Collections.emptyList());
        when(formationRepository.save(any(Formation.class))).thenReturn(formation);

        Result<FormationResponseDTO> actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        System.out.println(actual.getMessages());
        assertEquals(ResultType.SUCCESS, actual.getType());

        assertEquals("formation1", actual.getPayload().getFormationName());
    }

    @Test
    void shouldNotCreateInvalidFormation() {
        // formation is null
        Result<FormationResponseDTO> actual = formationService.createFormation(null, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // userId null
        actual = formationService.createFormation(formationCreateDTO, file, null);
        assertEquals(ResultType.INVALID, actual.getType());

        // user doesn't exist
        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(false);
        actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // file is null
        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(true);
        actual = formationService.createFormation(formationCreateDTO, null, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // file is blank
        MultipartFile newFile = new MockMultipartFile(
                "File",
                "test-image.png",
                "image/png",
                "".getBytes()
        );
        actual = formationService.createFormation(formationCreateDTO, newFile, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // name is null and blank
        formationCreateDTO.setFormationName(null);
        actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        formationCreateDTO.setFormationName(" ");
        actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // duplicate name
        formationCreateDTO.setFormationName(formation.getFormationName());
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(List.of(formation));
        actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // user not found
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(Collections.emptyList());
        when(imageService.uploadImage(file)).thenReturn(uploadResult);
        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.empty());
        actual = formationService.createFormation(formationCreateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }

    @Test
    void shouldUpdateValidFormation() {
        FormationUpdateDTO formationUpdateDTO = new FormationUpdateDTO(formation.getFormationId(), "New Formation");

        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(true);
        when(formationRepository.findByFormationIdAndUser_AppUserId(formationUpdateDTO.getFormationId(), appUser.getAppUserId()))
                .thenReturn(Optional.of(formation));
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(List.of(formation));
        when(formationRepository.findById(formationUpdateDTO.getFormationId())).thenReturn(Optional.of(formation));
        when(imageService.uploadImage(file)).thenReturn(uploadResult);
        doNothing().when(imageService).deleteImage(formation.getFormationPublicId());
        Formation newFormation = new Formation(formationUpdateDTO.getFormationId(), formationUpdateDTO.getFormationName(), formation.getFormationImageUrl(),
                formation.getFormationPublicId(), appUser);
        when(formationRepository.save(any(Formation.class))).thenReturn(newFormation);

        Result<FormationResponseDTO> actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals("New Formation", actual.getPayload().getFormationName());
    }

    @Test
    void shouldNotUpdateInvalidFormation() {
        FormationUpdateDTO formationUpdateDTO = new FormationUpdateDTO(formation.getFormationId(), "New Formation");

        // dto is null
        Result<FormationResponseDTO> actual = formationService.updateFormation(null, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // userId is null
        actual = formationService.updateFormation(formationUpdateDTO, file, null);
        assertEquals(ResultType.INVALID, actual.getType());

        // user doesnt exist
        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(false);
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // formationId is null
        when(appUserRepository.existsById(appUser.getAppUserId())).thenReturn(true);
        formationUpdateDTO.setFormationId(null);
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // formation doesn't belong to user
        formationUpdateDTO.setFormationId(formation.getFormationId());
        when(formationRepository.findByFormationIdAndUser_AppUserId(formationUpdateDTO.getFormationId(), appUser.getAppUserId()))
                .thenReturn(Optional.empty());
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // formation name is null and blank
        when(formationRepository.findByFormationIdAndUser_AppUserId(formationUpdateDTO.getFormationId(), appUser.getAppUserId()))
                        .thenReturn(Optional.of(formation));
        formationUpdateDTO.setFormationName(null);
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        formationUpdateDTO.setFormationName(" ");
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // duplicate name to another formation
        formationUpdateDTO.setFormationName("formation2");
        Formation formation2 = new Formation(2L, "formation2", "url", "id", appUser, null);
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(List.of(
                formation, formation2
        ));
        when(formationRepository.findById(formation.getFormationId())).thenReturn(Optional.of(formation));
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // trying to update with plays tied to formation
        when(formationRepository.findByUser_AppUserId(appUser.getAppUserId())).thenReturn(List.of(
                formation
        ));
        Play play1 = new Play("play1", "url1", "id", "notes", appUser, null, formation);
        formation.getPlays().add(play1);
        when(formationRepository.findById(formation.getFormationId())).thenReturn(Optional.of(formation));
        actual = formationService.updateFormation(formationUpdateDTO, file, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());
    }
}
