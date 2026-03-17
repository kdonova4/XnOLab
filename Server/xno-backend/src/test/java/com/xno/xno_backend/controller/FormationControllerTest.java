package com.xno.xno_backend.controller;
import com.xno.xno_backend.controllers.FormationController;
import com.xno.xno_backend.controllers.GlobalExceptionHandler;
import com.xno.xno_backend.controllers.PlaybookController;
import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.security.jwt.AuthTokenFilter;
import com.xno.xno_backend.services.FormationService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = FormationController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class FormationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthTokenFilter authTokenFilter;

    @MockitoBean
    FormationService formationService;

    Formation formation;
    FormationCreateDTO formationCreateDTO;
    FormationUpdateDTO formationUpdateDTO;
    FormationResponseDTO formationResponseDTO;

    @BeforeEach
    void setup() {
        formation = new Formation(1L, "formation", "url", "Id", null);
        formationCreateDTO = new FormationCreateDTO(formation.getFormationName());
        formationUpdateDTO = new FormationUpdateDTO(formation.getFormationId(), formation.getFormationName());
        formationResponseDTO = new FormationResponseDTO(formation.getFormationId(), formation.getFormationName(), formation.getFormationImageUrl());
    }

    @Test
    void shouldGetAllFormationsByUser() throws Exception {
        when(formationService.getAllFormationsByUser(null)).thenReturn(List.of(formationResponseDTO));

        var request = get("/api/formations/user");

        mockMvc.perform(request)
                .andExpect(status().isOk());
    }

    @Test
    void shouldSearchFormationsByName() throws Exception {
        when(formationService.searchByFormationName("form", null)).thenReturn(List.of(formationResponseDTO));

        var request = get("/api/formations/search/form");

        mockMvc.perform(request)
                .andExpect(status().isOk());
    }

    @Test
    void shouldCreateFormation() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.createFormation(formationCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationName", formationCreateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.formationId").value(1));
    }

    @Test
    void shouldNotCreateInvalidPlay400() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.INVALID);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.createFormation(formationCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationName", formationCreateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotCreateInvalidPlay404() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.createFormation(formationCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationName", formationCreateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldNotCreateInvalidPlay403() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.createFormation(formationCreateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationName", formationCreateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldNotCreateInvalidPlay500() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.createFormation(formationCreateDTO, file, null)).thenThrow(RuntimeException.class);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationName", formationCreateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA);

        mockMvc.perform(request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldUpdatePlay204() throws Exception {
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.updateFormation(formationUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationId", formationUpdateDTO.getFormationId().toString())
                .param("formationName", formationUpdateDTO.getFormationName())
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
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.INVALID);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.updateFormation(formationUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationId", formationUpdateDTO.getFormationId().toString())
                .param("formationName", formationUpdateDTO.getFormationName())
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
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.updateFormation(formationUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationId", formationUpdateDTO.getFormationId().toString())
                .param("formationName", formationUpdateDTO.getFormationName())
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
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.FORBIDDEN);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.updateFormation(formationUpdateDTO, file, null)).thenReturn(result);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationId", formationUpdateDTO.getFormationId().toString())
                .param("formationName", formationUpdateDTO.getFormationName())
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
        Result<FormationResponseDTO> result = new Result<>();
        result.setPayload(formationResponseDTO);
        result.addMessages("", ResultType.NOT_FOUND);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "test content".getBytes()
        );
        when(formationService.updateFormation(formationUpdateDTO, file, null)).thenThrow(RuntimeException.class);



        var request = multipart("/api/formations")
                .file(file)
                .param("formationId", formationUpdateDTO.getFormationId().toString())
                .param("formationName", formationUpdateDTO.getFormationName())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .with(request1 -> {
                    request1.setMethod("PUT");
                    return request1;
                });

        mockMvc.perform(request)
                .andExpect(status().isInternalServerError());
    }
}
