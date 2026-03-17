package com.xno.xno_backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.xno.xno_backend.controllers.GlobalExceptionHandler;
import com.xno.xno_backend.controllers.PlaybookController;
import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.InfoDTOs.UserInfoResponse;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;
import com.xno.xno_backend.security.jwt.AuthTokenFilter;
import com.xno.xno_backend.security.jwt.JwtUtils;
import com.xno.xno_backend.services.PlaybookService;
import com.xno.xno_backend.services.Result;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.mockito.Mockito.when;

@WebMvcTest(controllers = PlaybookController.class,
            excludeAutoConfiguration = SecurityAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class PlaybookControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    JwtUtils jwtUtils;

    @MockitoBean
    UserDetailsImpl userDetails;

    @MockitoBean
    AuthTokenFilter authTokenFilter;

    @MockitoBean
    PlaybookService playbookService;


    private String token;
    private final ObjectMapper jsonMapper = new ObjectMapper();
    private AppUser appUser;
    private AppRole appRole;
    private Playbook playbook;
    private PlaybookCreateDTO playbookCreateDTO;
    private PlaybookUpdateDTO playbookUpdateDTO;
    private PlaybookDetailResponseDTO playbookDetailResponseDTO;
    private PlaybookSummaryResponseDTO playbookSummaryResponseDTO;
    private UserDetailsImpl details;

    @BeforeEach
    void setup() {
        appRole = new AppRole(1L, Role.ROLE_USER);
        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "password1234", false, Set.of(appRole));

        SimpleGrantedAuthority role = new SimpleGrantedAuthority(appRole.getRoleName().name());

        details = new UserDetailsImpl(appUser.getAppUserId(), appUser.getUsername(),
                appUser.getEmail(), appUser.getPassword(), List.of(role));
        token = jwtUtils.generateTokenFromUsername(appUser.getUsername());
        jsonMapper.registerModule(new JavaTimeModule());
        jsonMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        playbook = new Playbook(1L,"playbook1", appUser, new ArrayList<>());
        playbookCreateDTO = new PlaybookCreateDTO(playbook.getPlaybookName());
        playbookUpdateDTO = new PlaybookUpdateDTO(playbook.getPlaybookId(), "New Playbook");

        playbookDetailResponseDTO = new PlaybookDetailResponseDTO(playbook.getPlaybookId(), playbook.getPlaybookName(),
                new ArrayList<>());
        playbookSummaryResponseDTO = new PlaybookSummaryResponseDTO(playbook.getPlaybookId(), playbook.getPlaybookName());
    }

    @Test
    void shouldGetPlaybookDetails200() throws Exception {
        when(playbookService.getPlaybookDetails(playbook.getPlaybookId(), 1L)).thenReturn(playbookDetailResponseDTO);

        var request = get("/api/playbooks/playbook/details/1")
                .with(user(userDetails));

        mockMvc.perform(request)
                .andExpect(status().isOk());
    }


    @Test
    void shouldNotFindPlaybookDetailsWith404() throws Exception {
        // Use any() for the second argument to be safe against ID mismatches
        when(playbookService.getPlaybookDetails(anyLong(), any()))
                .thenThrow(new ResourceNotFoundException("Not Found"));

        mockMvc.perform(get("/api/playbooks/playbook/details/1")
                        .with(user(userDetails))) // This sends the real userDetails to the controller
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetPlaybooksByUserWith200() throws Exception {
        when(playbookService.getAllPlaybooksByUser(1L)).thenReturn(List.of(playbookSummaryResponseDTO));

        mockMvc.perform(get("/api/playbooks/user"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldCreatePlaybookWith201() throws Exception {
        Result<PlaybookSummaryResponseDTO> result = new Result<>();
        result.setPayload(playbookSummaryResponseDTO);
        when(playbookService.createPlaybook(playbookCreateDTO, null)).thenReturn(result);

        String toJson = jsonMapper.writeValueAsString(playbookCreateDTO);

        var request = post("/api/playbooks")
                .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson)
                .with(user(details));

        mockMvc.perform(request)
                .andExpect(status().isCreated());
    }

    @Test
    void shouldUpdatePlaybookWith204() throws Exception {
        Result<PlaybookSummaryResponseDTO> result = new Result<>();
        result.setPayload(new PlaybookSummaryResponseDTO(playbookUpdateDTO.getPlaybookId(), playbookUpdateDTO.getPlaybookName()));
        when(playbookService.updatePlaybook(playbookUpdateDTO, null)).thenReturn(result);

        String toJson = jsonMapper.writeValueAsString(playbookUpdateDTO);

        var request = put("/api/playbooks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson)
                .with(user(details));

        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldDeletePlaybookWith204() throws Exception {

        doNothing().when(playbookService).deletePlaybook(playbook.getPlaybookId(), null);

        var request = delete("/api/playbooks/1");

        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }
}
