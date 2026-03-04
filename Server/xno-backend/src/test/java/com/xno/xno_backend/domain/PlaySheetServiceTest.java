package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetSituationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetSituationUpdateDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import com.xno.xno_backend.services.PlaySheetServiceImpl;
import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PlaySheetServiceTest {

    @Mock
    PlaySheetRepository playSheetRepository;

    @Mock
    PlaybookRepository playbookRepository;

    @Mock
    AppUserRepository appUserRepository;

    @Mock
    PlayRepository playRepository;

    @InjectMocks
    PlaySheetServiceImpl playSheetService;

    private AppUser appUser;
    private PlaySheet playSheet;
    private PlaySheet updatedPlaySheet;
    private PlaySheetCreateDTO playSheetCreateDTO;
    private PlaySheetUpdateDTO playSheetUpdateDTO;
    List<PlaySheetSituationCreateDTO> situationCreateDTOS;
    List<PlaySheetSituationUpdateDTO> situationUpdateDTOS;
    Play play1;
    Play play2;
    Play play3;

    @BeforeEach
    void setup() {
        AppRole role = new AppRole(Role.ROLE_USER);

        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com",
                "password1234", false, Set.of(role));
        Formation formation = new Formation(1L, "formation1", "url", "id", appUser);
        play1 = new Play(1L, "play1", "url1", "id", "notes", appUser, null, formation);
        play2 = new Play(2L, "play2", "url2", "id", "notes", appUser, null, formation);
        play3 = new Play(3L, "play3", "url3", "id", "notes", appUser, null, formation);

        Playbook playbook = new Playbook(1L, "playbook1", appUser, new ArrayList<>());

        play1.setPlaybook(playbook);
        play2.setPlaybook(playbook);
        play3.setPlaybook(playbook);
        playbook.getPlays().addAll(List.of(play1, play2, play3));



        playSheet = new PlaySheet(1L, "playsheet1", Timestamp.valueOf(LocalDateTime.now()),
                null, appUser, playbook, new HashSet<>());
        PlaySheetSituationPlay playSheetSituationPlay1 = new PlaySheetSituationPlay(1L, null, play1);
        PlaySheetSituationPlay playSheetSituationPlay2 = new PlaySheetSituationPlay(2L, null, play2);
        PlaySheetSituationPlay playSheetSituationPlay3 = new PlaySheetSituationPlay(3L, null, play3);

        PlaySheetSituation playSheetSituation1 = new PlaySheetSituation(1L, "situation1", "blue", playSheet, new HashSet<>());
        PlaySheetSituation playSheetSituation2 = new PlaySheetSituation(2L, "situation2", "green", playSheet, new HashSet<>());

        playSheet.getSituations().addAll(Set.of(playSheetSituation1, playSheetSituation2));

        playSheetSituationPlay1.setPlaySheetSituation(playSheetSituation1);
        playSheetSituationPlay2.setPlaySheetSituation(playSheetSituation1);
        playSheetSituationPlay3.setPlaySheetSituation(playSheetSituation2);
        playSheetSituation1.getPlays().addAll(Set.of(playSheetSituationPlay1, playSheetSituationPlay2));
        playSheetSituation2.getPlays().add(playSheetSituationPlay3);

        situationCreateDTOS = List.of(
                new PlaySheetSituationCreateDTO(playSheetSituation1.getSituationName(),
                        playSheetSituation1.getSituationColor(),
                        playSheetSituation1.getPlaySheet().getPlaySheetId(),
                        List.of(1L, 2L)),
                new PlaySheetSituationCreateDTO(playSheetSituation2.getSituationName(),
                        playSheetSituation2.getSituationColor(),
                        playSheetSituation2.getPlaySheet().getPlaySheetId(),
                        List.of(3L))

                );

        playSheetCreateDTO = new PlaySheetCreateDTO(playSheet.getPlaySheetName(), playbook.getPlaybookId(),
                situationCreateDTOS);

        situationUpdateDTOS = List.of(
                new PlaySheetSituationUpdateDTO(playSheetSituation1.getPlaySheetSituationId(),
                        "New Situation",
                        playSheetSituation1.getSituationColor(),
                        List.of(2L, 3L))
        );

        playSheetUpdateDTO = new PlaySheetUpdateDTO(
                playSheet.getPlaySheetId(),
                "New PlaySheet",
                situationUpdateDTOS
        );


        PlaySheetSituation updatedPlaySheetSituation1 = new PlaySheetSituation(1L, "New Situation", "blue", playSheet, new HashSet<>(Set.of(
                playSheetSituationPlay2, playSheetSituationPlay3
        )));


        updatedPlaySheet = new PlaySheet(
                playSheetUpdateDTO.getPlaySheetId(),
                playSheetUpdateDTO.getPlaySheetName(),
                playSheet.getCreatedAt(),
                Timestamp.valueOf(LocalDateTime.now()),
                playSheet.getUser(),
                playSheet.getPlaybook(),
                Set.of(updatedPlaySheetSituation1)
        );
    }

    @Test
    void shouldGetPlaySheetSummaryById() {
        when(playSheetRepository.findByPlaySheetIdAndUser_AppUserId(playSheet.getPlaySheetId(), appUser.getAppUserId()))
                .thenReturn(Optional.of(playSheet));

        PlaySheetSummaryResponseDTO actual = playSheetService.getPlaySheetSummaryById(playSheet.getPlaySheetId(), appUser.getAppUserId());
        assertEquals("playsheet1", actual.getPlaySheetName());
        verify(playSheetRepository).findByPlaySheetIdAndUser_AppUserId(playSheet.getPlaySheetId(), appUser.getAppUserId());
    }

    @Test
    void shouldLoadPlaySheetDetailsById() {
        when(playSheetRepository.loadPlaySheetByPlaySheetIdAndUserId(playSheet.getPlaySheetId(), appUser.getAppUserId()))
                .thenReturn(Optional.of(playSheet));

        PlaySheetDetailResponseDTO actual = playSheetService.loadPlaySheetDetailsById(playSheet.getPlaySheetId(), appUser.getAppUserId());

        assertEquals("playsheet1", actual.getPlaySheetName());
        assertEquals("playbook1", actual.getPlaybook().getPlaybookName());
        assertEquals(2, actual.getSituations().size());
        verify(playSheetRepository).loadPlaySheetByPlaySheetIdAndUserId(playSheet.getPlaySheetId(), appUser.getAppUserId());
    }

    @Test
    void searchPlaySheetByName() {
        when(playSheetRepository.findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId("play", appUser.getAppUserId()))
                .thenReturn(List.of(playSheet));

        List<PlaySheetSummaryResponseDTO> actual = playSheetService.searchPlaySheetByName("play", appUser.getAppUserId());
        assertEquals("playsheet1", actual.getFirst().getPlaySheetName());
        verify(playSheetRepository).findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId("play", appUser.getAppUserId());
    }

    @Test
    void shouldGetPlaySheetByUser() {
        when(playSheetRepository.findByUser_AppUserId(appUser.getAppUserId()))
                .thenReturn(List.of(playSheet));

        List<PlaySheetSummaryResponseDTO> actual = playSheetService.getPlaySheetByUser(appUser.getAppUserId());
        assertEquals("playsheet1", actual.getFirst().getPlaySheetName());
        verify(playSheetRepository).findByUser_AppUserId(appUser.getAppUserId());
    }

    @Test
    void shouldGetPlaySheetByPlaybook() {
        when(playSheetRepository.findByPlaybook_PlaybookIdAndUser_AppUserId(playSheet.getPlaybook().getPlaybookId(), appUser.getAppUserId()))
                .thenReturn(List.of(playSheet));

        List<PlaySheetSummaryResponseDTO> actual = playSheetService.getPlaySheetByPlaybook(playSheet.getPlaybook().getPlaybookId(), appUser.getAppUserId());
        assertEquals("playsheet1", actual.getFirst().getPlaySheetName());
        verify(playSheetRepository).findByPlaybook_PlaybookIdAndUser_AppUserId(playSheet.getPlaybook().getPlaybookId(), appUser.getAppUserId());
    }

    @Test
    void shouldCreateValidPlaySheet() {
        when(playbookRepository.findById(playSheetCreateDTO.getPlaybookId()))
                .thenReturn(Optional.of(playSheet.getPlaybook()));

        when(appUserRepository.findById(appUser.getAppUserId()))
                .thenReturn(Optional.of(appUser));

        when(playRepository.findById(anyLong())).thenAnswer(invocation -> {
            Long id = invocation.getArgument(0);

            if(id.equals(1L)) return Optional.of(play1);
            if(id.equals(2L)) return Optional.of(play2);
            if(id.equals(3L)) return Optional.of(play3);

            return Optional.empty();
        });

        when(playSheetRepository.save(any(PlaySheet.class))).thenReturn(playSheet);

        Result<PlaySheetSummaryResponseDTO> actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    @Test
    void shouldNotCreateInvalidPlaySheet() {
        // dto is null
        Result<PlaySheetSummaryResponseDTO> actual = playSheetService.createPlaySheet(null, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // userId is null
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, null);
        assertEquals(ResultType.INVALID, actual.getType());

        // name is null and blank
        playSheetCreateDTO.setPlaySheetName(null);
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetCreateDTO.setPlaySheetName("   ");
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // empty situation list
        playSheetCreateDTO.setPlaySheetName("PlaySheet1");
        List<PlaySheetSituationCreateDTO> temp = playSheetCreateDTO.getSituations();
        playSheetCreateDTO.setSituations(Collections.emptyList());
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation has no plays
        playSheetCreateDTO.setSituations(temp);
        List<Long> tempIds = playSheetCreateDTO.getSituations().getFirst().getPlayIds();
        playSheetCreateDTO.getSituations().getFirst().setPlayIds(Collections.emptyList());
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation name is blank and null
        playSheetCreateDTO.getSituations().getFirst().setPlayIds(tempIds);
        playSheetCreateDTO.getSituations().getFirst().setSituationName(null);
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetCreateDTO.getSituations().getFirst().setSituationName("   ");
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation color blank and null
        playSheetCreateDTO.getSituations().getFirst().setSituationName("situation122");
        playSheetCreateDTO.getSituations().getFirst().setSituationColor(null);
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetCreateDTO.getSituations().getFirst().setSituationColor("   ");
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // playbook not found
        playSheetCreateDTO.getSituations().getFirst().setSituationColor("Blue");
        when(playbookRepository.findById(playSheetCreateDTO.getPlaybookId()))
                .thenReturn(Optional.empty());
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // user does not own this playbook
        when(playbookRepository.findById(playSheetCreateDTO.getPlaybookId()))
                .thenReturn(Optional.of(playSheet.getPlaybook()));
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, 5L);
        assertEquals(ResultType.FORBIDDEN, actual.getType());

        // user not found
        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.empty());
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // a play is missing
        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.of(appUser));
        when(playRepository.findById(1L)).thenReturn(Optional.empty());
        actual = playSheetService.createPlaySheet(playSheetCreateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }

    @Test
    void shouldUpdateValidPlaySheet() {
        when(appUserRepository.findById(appUser.getAppUserId()))
                .thenReturn(Optional.of(appUser));

        when(playSheetRepository.findById(playSheetUpdateDTO.getPlaySheetId()))
                .thenReturn(Optional.of(playSheet));

        when(playRepository.findById(anyLong())).thenAnswer(invocation -> {
            Long id = invocation.getArgument(0);

            if(id.equals(1L)) return Optional.of(play1);
            if(id.equals(2L)) return Optional.of(play2);
            if(id.equals(3L)) return Optional.of(play3);

            return Optional.empty();
        });

        when(playSheetRepository.save(any(PlaySheet.class)))
                .thenReturn(updatedPlaySheet);

        Result<PlaySheetSummaryResponseDTO> actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals("New PlaySheet", actual.getPayload().getPlaySheetName());
    }

    @Test
    void shouldNotUpdateInvalidPlaySheet() {

        // dto is null
        Result<PlaySheetSummaryResponseDTO> actual = playSheetService.updatePlaySheet(null, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // userId is null
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, null);
        assertEquals(ResultType.INVALID, actual.getType());

        // name is null and blank
        playSheetUpdateDTO.setPlaySheetName(null);
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetUpdateDTO.setPlaySheetName("   ");
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // user not found
        playSheetUpdateDTO.setPlaySheetName("Updated PlaySheet");
        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.empty());
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // empty situation list
        when(appUserRepository.findById(appUser.getAppUserId())).thenReturn(Optional.of(appUser));
        List<PlaySheetSituationUpdateDTO> temp = playSheetUpdateDTO.getSituations();
        playSheetUpdateDTO.setSituations(Collections.emptyList());
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation has no plays
        playSheetUpdateDTO.setSituations(temp);
        List<Long> tempIds = playSheetUpdateDTO.getSituations().getFirst().getPlayIds();
        playSheetUpdateDTO.getSituations().getFirst().setPlayIds(Collections.emptyList());
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation name is blank and null
        playSheetUpdateDTO.getSituations().getFirst().setPlayIds(tempIds);
        playSheetUpdateDTO.getSituations().getFirst().setSituationName(null);
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetUpdateDTO.getSituations().getFirst().setSituationName("   ");
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // situation color blank and null
        playSheetUpdateDTO.getSituations().getFirst().setSituationName("situation122");
        playSheetUpdateDTO.getSituations().getFirst().setSituationColor(null);
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playSheetUpdateDTO.getSituations().getFirst().setSituationColor("   ");
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // play sheet not found
        playSheetUpdateDTO.getSituations().getFirst().setSituationColor("Blue");
        when(playSheetRepository.findById(playSheetUpdateDTO.getPlaySheetId())).thenReturn(Optional.empty());
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // user does not own this PlaySheet
        when(playSheetRepository.findById(playSheetUpdateDTO.getPlaySheetId())).thenReturn(Optional.of(playSheet));
        when(appUserRepository.findById(5L)).thenReturn(Optional.of(appUser));
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, 5L);
        assertEquals(ResultType.FORBIDDEN, actual.getType());

        // a play is missing
        when(playRepository.findById(anyLong())).thenReturn(Optional.empty());
        actual = playSheetService.updatePlaySheet(playSheetUpdateDTO, appUser.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }
}
