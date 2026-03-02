package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.models.Role;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import com.xno.xno_backend.services.PlaybookServiceImpl;
import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PlaybookServiceTest {
    @Mock
    PlaybookRepository playbookRepository;

    @Mock
    AppUserRepository appUserRepository;

    @InjectMocks
    PlaybookServiceImpl playbookService;

    private AppUser appUser;
    private AppRole appRole;
    private Playbook playbook;
    private PlaybookCreateDTO playbookCreateDTO;
    private PlaybookUpdateDTO playbookUpdateDTO;

    @BeforeEach
    void setup() {
        appRole = new AppRole(1L, Role.ROLE_USER);
        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "password1234", false, Set.of(appRole));
        playbook = new Playbook(1L,"playbook1", appUser, new ArrayList<>());
        playbookCreateDTO = new PlaybookCreateDTO(playbook.getPlaybookName());
        playbookUpdateDTO = new PlaybookUpdateDTO(playbook.getPlaybookId(), "New Playbook");
    }


    @Test
    void shouldGetPlaybookDetails() {
        when(playbookRepository.loadPlaybookByPlaybookId(playbook.getPlaybookId(), appUser.getAppUserId()))
                .thenReturn(Optional.of(playbook));

        PlaybookDetailResponseDTO actual = playbookService.getPlaybookDetails(playbook.getPlaybookId(), appUser.getAppUserId());
        assertEquals(playbook.getPlaybookName(), actual.getPlaybookName());
        assertEquals(0, actual.getPlays().size());
    }

    @Test
    void shouldGetAllPlaybooksByUser() {
        when(playbookRepository.findByUser_AppUserId(appUser.getAppUserId()))
                .thenReturn(List.of(playbook));

        List<PlaybookSummaryResponseDTO> responseDTOS = playbookService.getAllPlaybooksByUser(appUser.getAppUserId());
        assertEquals("playbook1", responseDTOS.getFirst().getPlaybookName());
    }

    @Test
    void shouldCreateValidPlaybook() {
        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(true);
        when(playbookRepository.existsByUser_AppUserIdAndPlaybookName(appUser.getAppUserId(), playbook.getPlaybookName()))
                .thenReturn(false);
        when(appUserRepository.findById(appUser.getAppUserId()))
                .thenReturn(Optional.of(appUser));
        when(playbookRepository.save(any(Playbook.class))).thenReturn(playbook);

        Result<PlaybookSummaryResponseDTO> actual = playbookService.createPlaybook(playbookCreateDTO, appUser.getAppUserId());
        System.out.println(actual.getMessages());
        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals("playbook1", actual.getPayload().getPlaybookName());
    }

    @Test
    void shouldNotCreateInvalidPlaybook() {
        // dto is null
        Result<PlaybookSummaryResponseDTO> actual = playbookService.createPlaybook(null, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // name is blank and empty
        playbookCreateDTO.setPlaybookName(null);
        actual = playbookService.createPlaybook(playbookCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playbookCreateDTO.setPlaybookName(" ");
        actual = playbookService.createPlaybook(playbookCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // user is null and not found
        playbookCreateDTO.setPlaybookName("playbook1");
        actual = playbookService.createPlaybook(playbookCreateDTO, null);
        assertEquals(ResultType.INVALID, actual.getType());

        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(false);
        actual = playbookService.createPlaybook(playbookCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // duplicate name
        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(true);
        when(playbookRepository.existsByUser_AppUserIdAndPlaybookName(appUser.getAppUserId(), playbookCreateDTO.getPlaybookName()))
                .thenReturn(true);
        actual = playbookService.createPlaybook(playbookCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());
    }

    @Test
    void shouldUpdateValidPlaybook() {

        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(true);
        when(playbookRepository.existsByUser_AppUserIdAndPlaybookNameAndPlaybookIdNot(appUser.getAppUserId(), playbookUpdateDTO.getPlaybookName(), playbook.getPlaybookId()))
                .thenReturn(false);
        when(playbookRepository.findByPlaybookIdAndUser_AppUserId(playbookUpdateDTO.getPlaybookId(), appUser.getAppUserId()))
                .thenReturn(Optional.of(playbook));
        playbook.setPlaybookName(playbookUpdateDTO.getPlaybookName());
        when(playbookRepository.save(any(Playbook.class)))
                .thenReturn(playbook);

        Result<PlaybookSummaryResponseDTO> actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals(playbookUpdateDTO.getPlaybookName(), actual.getPayload().getPlaybookName());
    }
    @Test
    void shouldNotUpdateInvalidPlaybook() {
        // dto is null
        Result<PlaybookSummaryResponseDTO> actual = playbookService.updatePlaybook(null, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // name is blank and empty
        playbookCreateDTO.setPlaybookName(null);
        actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playbookCreateDTO.setPlaybookName(" ");
        actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // user is null and not found
        playbookCreateDTO.setPlaybookName("playbook1");
        actual = playbookService.updatePlaybook(playbookUpdateDTO, null);
        assertEquals(ResultType.INVALID, actual.getType());

        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(false);
        actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // duplicate name
        when(appUserRepository.existsById(appUser.getAppUserId()))
                .thenReturn(true);
        when(playbookRepository.existsByUser_AppUserIdAndPlaybookNameAndPlaybookIdNot(appUser.getAppUserId(), playbookUpdateDTO.getPlaybookName(),
                playbookUpdateDTO.getPlaybookId()))
                .thenReturn(true);
        actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());



        // playbook not found
         when(playbookRepository.existsByUser_AppUserIdAndPlaybookNameAndPlaybookIdNot(appUser.getAppUserId(), playbookUpdateDTO.getPlaybookName(),
                 playbookUpdateDTO.getPlaybookId()))
                 .thenReturn(false);
        when(playbookRepository.findByPlaybookIdAndUser_AppUserId(playbookUpdateDTO.getPlaybookId(), appUser.getAppUserId()))
                .thenReturn(Optional.empty());
        actual = playbookService.updatePlaybook(playbookUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }
}
