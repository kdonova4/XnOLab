package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.DTOs.CreateDTOs.FormationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.FormationUpdateDTO;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.services.FormationService;
import com.xno.xno_backend.services.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<FormationResponseDTO> getFormationById(@PathVariable Long formationId,
                                                                 @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FormationResponseDTO formation = formationService.getFormationById(formationId, userDetails.getUserId());

        return ResponseEntity.ok(formation);
    }

    @GetMapping("/user")
    public ResponseEntity<List<FormationResponseDTO>> getAllFormationsByUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<FormationResponseDTO> responseDTOS = formationService.getAllFormationsByUser(userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/search/{formationName}")
    public ResponseEntity<List<FormationResponseDTO>> searchByFormationName(@PathVariable String formationName,
                                                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<FormationResponseDTO> responseDTOS = formationService.searchByFormationName(formationName, userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFormation(@ModelAttribute FormationCreateDTO createDTO,
                                                                @RequestParam("file") MultipartFile file,
                                                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<FormationResponseDTO> result = formationService.createFormation(createDTO, file, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFormation(@ModelAttribute FormationUpdateDTO updateDTO,
                                             @RequestParam(value = "file", required = false) MultipartFile file,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<FormationResponseDTO> result = formationService.updateFormation(updateDTO, file, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{formationId}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long formationId,
                                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        formationService.deleteFormation(formationId, userDetails.getUserId());

        return ResponseEntity.noContent().build();
    }
}
