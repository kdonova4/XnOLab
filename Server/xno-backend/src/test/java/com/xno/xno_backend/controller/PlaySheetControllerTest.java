package com.xno.xno_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xno.xno_backend.controllers.GlobalExceptionHandler;
import com.xno.xno_backend.controllers.PlaySheetController;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.models.PlaySheet;
import com.xno.xno_backend.models.ResourceNotFoundException;
import com.xno.xno_backend.security.jwt.AuthTokenFilter;
import com.xno.xno_backend.services.PlaySheetService;
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
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PlaySheetController.class,
excludeAutoConfiguration = SecurityAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class PlaySheetControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthTokenFilter authTokenFilter;

    @MockitoBean
    PlaySheetService playSheetService;

    final ObjectMapper jsonMapper = new ObjectMapper();
    PlaySheet playSheet;
    PlaySheetSummaryResponseDTO playSheetSummaryResponseDTO;
    PlaySheetDetailResponseDTO playSheetDetailResponseDTO;
    PlaySheetCreateDTO playSheetCreateDTO;
    PlaySheetUpdateDTO playSheetUpdateDTO;

    @BeforeEach
    void setup() {
        playSheet = new PlaySheet(1L, "playsheet1", Timestamp.valueOf(LocalDateTime.now()),
                null, null, null, new HashSet<>());

        playSheetSummaryResponseDTO = new PlaySheetSummaryResponseDTO(playSheet.getPlaySheetId(), playSheet.getPlaySheetName(), playSheet.getCreatedAt(),
                playSheet.getUpdatedAt(), null);

        playSheetDetailResponseDTO = new PlaySheetDetailResponseDTO(playSheet.getPlaySheetId(), playSheet.getPlaySheetName(), playSheet.getCreatedAt(),
                playSheet.getUpdatedAt(), null, null);

        playSheetCreateDTO = new PlaySheetCreateDTO(playSheet.getPlaySheetName(), 1L, null);

        playSheetUpdateDTO = new PlaySheetUpdateDTO(playSheet.getPlaySheetId(), playSheet.getPlaySheetName(), null);

    }

    @Test
    void shouldGetPlaySheetByUser() throws Exception {
        when(playSheetService.getPlaySheetByUser(null)).thenReturn(List.of(playSheetSummaryResponseDTO));

        var request = get("/api/playsheets/user");

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playSheetId").value(1));
    }

    @Test
    void shouldGetPlaySheetByPlaybook() throws Exception {
        when(playSheetService.getPlaySheetByPlaybook(1L, null)).thenReturn(List.of(playSheetSummaryResponseDTO));

        var request = get("/api/playsheets/playbook/1");

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playSheetId").value(1));
    }

    @Test
    void shouldSearchPlaySheetByName() throws Exception {
        when(playSheetService.searchPlaySheetByName("play", null)).thenReturn(List.of(playSheetSummaryResponseDTO));

        var request = get("/api/playsheets/search/play");

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playSheetId").value(1));
    }

    @Test
    void shouldGetPlaySheetDetailsById() throws Exception {
        when(playSheetService.loadPlaySheetDetailsById(1L, null)).thenReturn(playSheetDetailResponseDTO);

        var request = get("/api/playsheets/playsheet/details/1");

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playSheetId").value(1));
    }

    @Test
    void shouldNotGetPlaySheetDetailsByIdNotFound404() throws Exception {
        when(playSheetService.loadPlaySheetDetailsById(1L, null)).thenThrow(ResourceNotFoundException.class);

        var request = get("/api/playsheets/playsheet/details/1");

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetPlaySheetSummaryById() throws Exception {
        when(playSheetService.getPlaySheetSummaryById(1L, null)).thenReturn(playSheetSummaryResponseDTO);

        var request = get("/api/playsheets/playsheet/summary/1");

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playSheetId").value(1));
    }

    @Test
    void shouldNotGetPlaySheetSummaryByIdNotFound404() throws Exception {
        when(playSheetService.getPlaySheetSummaryById(1L, null)).thenThrow(ResourceNotFoundException.class);

        var request = get("/api/playsheets/playsheet/summary/1");

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreatePlaySheet() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);

        when(playSheetService.createPlaySheet(playSheetCreateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetCreateDTO);

        var request = post("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isCreated());
    }

    @Test
    void shouldNotCreatePlaySheet400() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.INVALID);

        when(playSheetService.createPlaySheet(playSheetCreateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetCreateDTO);

        var request = post("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotCreatePlaySheet404() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);

        when(playSheetService.createPlaySheet(playSheetCreateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetCreateDTO);

        var request = post("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotCreatePlaySheet403() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);

        when(playSheetService.createPlaySheet(playSheetCreateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetCreateDTO);

        var request = post("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldUpdatePlaySheet() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.INVALID);

        when(playSheetService.updatePlaySheet(playSheetUpdateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetUpdateDTO);

        var request = put("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotUpdatePlaySheet400() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.INVALID);

        when(playSheetService.updatePlaySheet(playSheetUpdateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetUpdateDTO);

        var request = put("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotUpdatePlaySheet404() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);

        when(playSheetService.updatePlaySheet(playSheetUpdateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetUpdateDTO);

        var request = put("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotUpdatePlaySheet403() throws Exception {

        Result<PlaySheetSummaryResponseDTO> result = new Result<>();
        result.setPayload(playSheetSummaryResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);

        when(playSheetService.updatePlaySheet(playSheetUpdateDTO, null)).thenReturn(result);

        String contentJson = jsonMapper.writeValueAsString(playSheetUpdateDTO);

        var request = put("/api/playsheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(contentJson);

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDeletePlaybookWith204() throws Exception {

        doNothing().when(playSheetService).deletePlaySheet(playSheet.getPlaySheetId(), null);

        var request = delete("/api/playsheets/1");

        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }
}
