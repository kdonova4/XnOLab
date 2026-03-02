package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetSituationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetSituationUpdateDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import com.xno.xno_backend.services.PlaySheetServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

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

    @BeforeEach
    void setup() {
        AppRole role = new AppRole(Role.ROLE_USER);

        appUser = new AppUser("kdonova4", "kdonova4@gmail.com",
                "password1234", false, Set.of(role));
        Formation formation = new Formation(1L, "formation1", "url", "id", appUser);
        Play play1 = new Play(1L, "play1", "url1", "id", "notes", appUser, null, formation);
        Play play2 = new Play(2L, "play2", "url2", "id", "notes", appUser, null, formation);
        Play play3 = new Play(3L, "play3", "url3", "id", "notes", appUser, null, formation);

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
}
