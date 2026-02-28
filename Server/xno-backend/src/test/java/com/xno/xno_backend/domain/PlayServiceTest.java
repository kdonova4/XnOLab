package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import com.xno.xno_backend.services.*;
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
public class PlayServiceTest {

    @Mock
    PlayRepository playRepository;

    @Mock
    FormationRepository formationRepository;

    @Mock
    PlaybookRepository playbookRepository;

    @Mock
    AppUserRepository appUserRepository;

    @Mock
    CloudinaryImageService imageService;

    @InjectMocks
    PlayServiceImpl playService;

    AppRole role;
    AppUser user;
    Playbook playbook;
    Formation formation;
    Play play1;
    Play play2;
    Play play3;
    PlayCreateDTO playCreateDTO;
    MultipartFile file;
    Map uploadResult;

    @BeforeEach
    void setup() {
        role = new AppRole(Role.ROLE_USER);

        user = new AppUser(1L, "kdonova4", "kdonova4@gmail.com",
                "password1234", false, Set.of(role));

        playbook = new Playbook(1L,"playbook1", user);

        formation = new Formation(1L,"formation1", "url", "id", user);

        play1 = new Play(1L, "play1", "url1", "id", "notes", user, playbook, formation);
        play2 = new Play(2L,"play2", "url2", "id", "notes", user, playbook, formation);
        play3 = new Play(3L, "play3", "url3", "id", "notes", user, playbook, formation);

        playCreateDTO = new PlayCreateDTO(play1.getPlayName(), play1.getNotes(), play1.getFormation().getFormationId(), play1.getPlaybook().getPlaybookId());

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
    void shouldSearchPlaysByName() {
        when(playRepository.findByPlayNameContainingIgnoreCaseAndUser_AppUserId("play", user.getAppUserId())).thenReturn(
                List.of(
                        play1,
                        play2,
                        play3
                )
        );

        List<PlayResponseDTO> playResponseDTOS = playService.searchPlaysByName("play", user.getAppUserId());

        assertEquals(3, playResponseDTOS.size());
        assertEquals("play1", playResponseDTOS.getFirst().getPlayName());
        assertEquals("formation1", playResponseDTOS.getFirst().getFormationResponse().getFormationName());
        verify(playRepository).findByPlayNameContainingIgnoreCaseAndUser_AppUserId("play", user.getAppUserId());
    }

    @Test
    void shouldGetPlaysByPlaybook() {
        when(playRepository.findByPlaybook_PlaybookIdAndPlaybook_User_AppUserId(playbook.getPlaybookId(), user.getAppUserId())).thenReturn(
                List.of(
                        play1,
                        play2,
                        play3
                )
        );

        List<PlayResponseDTO> playResponseDTOS = playService.getPlaysByPlaybook(playbook.getPlaybookId(), user.getAppUserId());

        assertEquals(3, playResponseDTOS.size());
        assertEquals("play1", playResponseDTOS.getFirst().getPlayName());
        assertEquals("formation1", playResponseDTOS.getFirst().getFormationResponse().getFormationName());
        verify(playRepository).findByPlaybook_PlaybookIdAndPlaybook_User_AppUserId(playbook.getPlaybookId(), user.getAppUserId());
    }

    @Test
    void shouldGetPlaysByFormation() {
        when(playRepository.findByFormation_FormationIdAndFormation_User_AppUserId(formation.getFormationId(), user.getAppUserId())).thenReturn(
                List.of(
                        play1,
                        play2,
                        play3
                )
        );

        List<PlayResponseDTO> playResponseDTOS = playService.getPlaysByFormation(formation.getFormationId(), user.getAppUserId());

        assertEquals(3, playResponseDTOS.size());
        assertEquals("play1", playResponseDTOS.getFirst().getPlayName());
        assertEquals("formation1", playResponseDTOS.getFirst().getFormationResponse().getFormationName());
        verify(playRepository).findByFormation_FormationIdAndFormation_User_AppUserId(formation.getFormationId(), user.getAppUserId());
    }

    @Test
    void shouldCreateValidPlay() {
        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playCreateDTO.getPlayName(),
                play1.getUser().getAppUserId(), playCreateDTO.getPlaybookId())).thenReturn(Optional.empty());

        when(appUserRepository.findById(play1.getUser().getAppUserId())).thenReturn(Optional.of(user));
        when(playbookRepository.findById(play1.getPlaybook().getPlaybookId())).thenReturn(Optional.of(playbook));
        when(formationRepository.findById(play1.getFormation().getFormationId())).thenReturn(Optional.of(formation));
        when(imageService.uploadImage(file)).thenReturn(uploadResult);
        when(playRepository.save(any(Play.class))).thenReturn(play1);

        Result<PlayResponseDTO> actual = playService.createPlay(playCreateDTO, file, play1.getUser().getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals("formation1", actual.getPayload().getFormationResponse().getFormationName());
    }

    @Test
    void shouldNotCreateInvalidPlay() {

        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playCreateDTO.getPlayName(), user.getAppUserId(),
                playCreateDTO.getPlaybookId())).thenReturn(Optional.empty());

        // make dto null
        Result<PlayResponseDTO> actual = playService.createPlay(null, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // make file null
        actual = playService.createPlay(playCreateDTO, null, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // make empty file
        MultipartFile empty = new MockMultipartFile(
                "File",
                "test-image.png",
                "image/png",
                "".getBytes()
        );
        actual = playService.createPlay(playCreateDTO, empty, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // make play name null and blank
        playCreateDTO.setPlayName(null);
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playCreateDTO.setPlayName(" ");
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // set notes over 1000 chars
        playCreateDTO.setPlayName("play1");
        playCreateDTO.setPlayNotes("a".repeat(1001));
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // make play name duplicated
        playCreateDTO.setPlayNotes("notes");
        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playCreateDTO.getPlayName(), user.getAppUserId(),
                playCreateDTO.getPlaybookId())).thenReturn(Optional.of(play1));
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playCreateDTO.getPlayName(), user.getAppUserId(),
                playCreateDTO.getPlaybookId())).thenReturn(Optional.empty());

        // cant find user
        when(appUserRepository.findById(play1.getUser().getAppUserId())).thenReturn(Optional.empty());
        when(playbookRepository.findById(play1.getPlaybook().getPlaybookId())).thenReturn(Optional.of(playbook));
        when(formationRepository.findById(play1.getFormation().getFormationId())).thenReturn(Optional.of(formation));
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // cant find playbook
        when(appUserRepository.findById(play1.getUser().getAppUserId())).thenReturn(Optional.of(user));
        when(playbookRepository.findById(play1.getPlaybook().getPlaybookId())).thenReturn(Optional.empty());
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // cant find formation
        when(playbookRepository.findById(play1.getPlaybook().getPlaybookId())).thenReturn(Optional.of(playbook));
        when(formationRepository.findById(play1.getFormation().getFormationId())).thenReturn(Optional.empty());
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // playbook doesn't belong to user
        when(formationRepository.findById(play1.getFormation().getFormationId())).thenReturn(Optional.of(formation));
        AppUser appUser = new AppUser(5L, user.getUsername(), user.getEmail(), user.getPassword(), false, user.getRoles());
        playbook.setUser(appUser);
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.FORBIDDEN, actual.getType());

    }

    @Test
    void shouldUpdateValidPlay() {
        PlayUpdateDTO playUpdateDTO = new PlayUpdateDTO(1L, "newPlay", "new Notes");

        when(playRepository.findById(playUpdateDTO.getPlayId())).thenReturn(Optional.of(play1));
        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playUpdateDTO.getPlayName(), user.getAppUserId(), playbook.getPlaybookId()))
                .thenReturn(Optional.empty());

        MultipartFile newImage = new MockMultipartFile(
                "File",
                "test-image.png",
                "image/png",
                "New Image".getBytes()
        );

        when(imageService.uploadImage(newImage)).thenReturn(uploadResult);
        doNothing().when(imageService).deleteImage(play1.getPlayPublicId());

        Play newPlay = new Play(playUpdateDTO.getPlayId(), playUpdateDTO.getPlayName(), play1.getPlayImageUrl(),
                play1.getPlayPublicId(), playUpdateDTO.getPlayNotes(), user, playbook, formation);
        when(playRepository.save(any(Play.class))).thenReturn(newPlay);

        Result<PlayResponseDTO> actual = playService.updatePlay(playUpdateDTO, newImage, user.getAppUserId());

        assertEquals(ResultType.SUCCESS, actual.getType());
        assertEquals("newPlay", actual.getPayload().getPlayName());
    }

    @Test
    void shouldNotUpdateInvalidPlay() {
        PlayUpdateDTO playUpdateDTO = new PlayUpdateDTO(1L, "newPlay", "new Notes");



        // play not found
        when(playRepository.findById(playUpdateDTO.getPlayId())).thenReturn(Optional.empty());

        Result<PlayResponseDTO> actual = playService.updatePlay(playUpdateDTO, file, user.getAppUserId());
        assertEquals(ResultType.NOT_FOUND, actual.getType());

        // play duplicated in playbook
        when(playRepository.findById(playUpdateDTO.getPlayId())).thenReturn(Optional.of(play1));
        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playUpdateDTO.getPlayName(), user.getAppUserId(), playbook.getPlaybookId()))
                .thenReturn(Optional.of(play1));
        actual = playService.updatePlay(playUpdateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // play doesn't belong to user
        when(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playUpdateDTO.getPlayName(), user.getAppUserId(), playbook.getPlaybookId()))
                .thenReturn(Optional.empty());
        AppUser appUser = new AppUser(5L, user.getUsername(), user.getEmail(), user.getPassword(), false, user.getRoles());
        play1.setUser(appUser);
        actual = playService.updatePlay(playUpdateDTO, file, user.getAppUserId());
        assertEquals(ResultType.FORBIDDEN, actual.getType());

        // dto is null
        play1.setUser(user);
        actual = playService.updatePlay(null, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // name is null and blank
        playUpdateDTO.setPlayName(null);
        actual = playService.updatePlay(playUpdateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        playUpdateDTO.setPlayName(" ");
        actual = playService.updatePlay(playUpdateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        // file is null and empty
        playUpdateDTO.setPlayName("new play");
        actual = playService.updatePlay(playUpdateDTO, null, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());

        MultipartFile newImage = new MockMultipartFile(
                "File",
                "test-image.png",
                "image/png",
                "".getBytes()
        );
        actual = playService.updatePlay(playUpdateDTO, newImage, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());


        playCreateDTO.setPlayNotes("a".repeat(1001));
        actual = playService.createPlay(playCreateDTO, file, user.getAppUserId());
        assertEquals(ResultType.INVALID, actual.getType());
    }
}

