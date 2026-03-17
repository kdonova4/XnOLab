package com.xno.xno_backend.controller;
import com.xno.xno_backend.controllers.GlobalExceptionHandler;
import com.xno.xno_backend.controllers.PlayController;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.models.Play;
import com.xno.xno_backend.security.jwt.AuthTokenFilter;
import com.xno.xno_backend.services.PlayService;
import com.xno.xno_backend.services.Result;
import com.xno.xno_backend.services.ResultType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PlayController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class PlayControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthTokenFilter authTokenFilter;

    @MockitoBean
    PlayService playService;

    Play play;
    PlayCreateDTO playCreateDTO;
    PlayUpdateDTO playUpdateDTO;
    PlayResponseDTO playResponseDTO;

    @BeforeEach
    void setup() {
        play = new Play(1L, "play", "url", "id", "notes", null, null, null);
        playCreateDTO = new PlayCreateDTO(play.getPlayName(), play.getNotes(), 1L, 1L);
        playUpdateDTO = new PlayUpdateDTO(play.getPlayId(), play.getPlayName(), play.getNotes());
        playResponseDTO = new PlayResponseDTO(play.getPlayId(), play.getPlayName(), play.getPlayImageUrl(), play.getNotes(), null);
    }

    @Test
    void shouldSearchPlaysByName() throws Exception {
        when(playService.searchPlaysByName("play", null)).thenReturn(List.of(playResponseDTO));

        var request = get("/api/plays/search/play");

        mockMvc.perform(request).andExpect(status().isOk());
    }

    @Test
    void shouldGetPlaysByPlaybook() throws Exception {
        when(playService.getPlaysByPlaybook(1L, null)).thenReturn(List.of(playResponseDTO));

        var request = get("/api/plays/playbook/1");

        mockMvc.perform(request).andExpect(status().isOk());
    }

    @Test
    void shouldGetPlaysByFormation() throws Exception {
        when(playService.getPlaysByFormation(1L, null)).thenReturn(List.of(playResponseDTO));

        var request = get("/api/plays/formation/1");

        mockMvc.perform(request).andExpect(status().isOk());
    }

    @Test
    void shouldCreatePlay() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.createPlay(playCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playName", playCreateDTO.getPlayName())
                .param("playNotes", playCreateDTO.getPlayNotes())
                .param("formationId", playCreateDTO.getFormationId().toString())
                .param("playbookId", playCreateDTO.getPlaybookId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.playId").value(1));
    }

    @Test
    void shouldNotCreateInvalidPlay400() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.INVALID);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.createPlay(playCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playName", playCreateDTO.getPlayName())
                .param("playNotes", playCreateDTO.getPlayNotes())
                .param("formationId", playCreateDTO.getFormationId().toString())
                .param("playbookId", playCreateDTO.getPlaybookId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotCreateInvalidPlay404() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.createPlay(playCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playName", playCreateDTO.getPlayName())
                .param("playNotes", playCreateDTO.getPlayNotes())
                .param("formationId", playCreateDTO.getFormationId().toString())
                .param("playbookId", playCreateDTO.getPlaybookId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotCreateInvalidPlay403() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.createPlay(playCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playName", playCreateDTO.getPlayName())
                .param("playNotes", playCreateDTO.getPlayNotes())
                .param("formationId", playCreateDTO.getFormationId().toString())
                .param("playbookId", playCreateDTO.getPlaybookId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldNotCreateInvalidPlay500() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.createPlay(playCreateDTO, file, null)).thenThrow(RuntimeException.class);



        var request = multipart("/api/plays")
                .file(file)
                .param("playName", playCreateDTO.getPlayName())
                .param("playNotes", playCreateDTO.getPlayNotes())
                .param("formationId", playCreateDTO.getFormationId().toString())
                .param("playbookId", playCreateDTO.getPlaybookId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldUpdatePlay204() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.updatePlay(playUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playId", playUpdateDTO.getPlayId().toString())
                .param("playName", playUpdateDTO.getPlayName())
                .param("playNotes", playUpdateDTO.getPlayNotes())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(request1 -> {
                            request1.setMethod("PUT");
                            return request1;
                        });

        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldUpdatePlay400() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.INVALID);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.updatePlay(playUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playId", playUpdateDTO.getPlayId().toString())
                .param("playName", playUpdateDTO.getPlayName())
                .param("playNotes", playUpdateDTO.getPlayNotes())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .with(request1 -> {
                    request1.setMethod("PUT");
                    return request1;
                });

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotUpdateNotFound404() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.updatePlay(playUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playId", playUpdateDTO.getPlayId().toString())
                .param("playName", playUpdateDTO.getPlayName())
                .param("playNotes", playUpdateDTO.getPlayNotes())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .with(request1 -> {
                    request1.setMethod("PUT");
                    return request1;
                });

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotUpdateForbidden403() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.updatePlay(playUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/plays")
                .file(file)
                .param("playId", playUpdateDTO.getPlayId().toString())
                .param("playName", playUpdateDTO.getPlayName())
                .param("playNotes", playUpdateDTO.getPlayNotes())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .with(request1 -> {
                    request1.setMethod("PUT");
                    return request1;
                });

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldNotUpdateUploadError500() throws Exception {
        Result<PlayResponseDTO> result = new Result<>();
        result.setPayload(playResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(playService.updatePlay(playUpdateDTO, file, null)).thenThrow(RuntimeException.class);



        var request = multipart("/api/plays")
                .file(file)
                .param("playId", playUpdateDTO.getPlayId().toString())
                .param("playName", playUpdateDTO.getPlayName())
                .param("playNotes", playUpdateDTO.getPlayNotes())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .with(request1 -> {
                    request1.setMethod("PUT");
                    return request1;
                });

        mockMvc.perform(request)
                .andExpect(status().isInternalServerError());
    }
}
