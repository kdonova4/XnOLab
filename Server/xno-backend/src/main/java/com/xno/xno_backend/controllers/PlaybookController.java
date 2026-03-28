package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.services.PlaybookService;
import com.xno.xno_backend.services.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playbooks")
public class PlaybookController {

    private final PlaybookService playbookService;

    public PlaybookController(PlaybookService playbookService) {
        this.playbookService = playbookService;
    }

    @GetMapping("/playbook/summary/{playbookId}")
    public ResponseEntity<PlaybookSummaryResponseDTO> getPlaybookSummaryById(@PathVariable Long playbookId,
                                                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        PlaybookSummaryResponseDTO playbookSummaryResponseDTO = playbookService.getPlaybookSummaryById(playbookId, userDetails.getUserId());

        return ResponseEntity.ok(playbookSummaryResponseDTO);
    }

    @GetMapping("/playbook/details/{playbookId}")
    public ResponseEntity<PlaybookDetailResponseDTO> getPlaybookDetails(@PathVariable Long playbookId,
                                                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        PlaybookDetailResponseDTO responseDTO = playbookService.getPlaybookDetails(playbookId, userDetails.getUserId());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/user")
    public ResponseEntity<List<PlaybookSummaryResponseDTO>> getPlaybooksByUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlaybookSummaryResponseDTO> responseDTOS = playbookService.getAllPlaybooksByUser(userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @PostMapping
    public ResponseEntity<?> createPlaybook(@RequestBody PlaybookCreateDTO createDTO,
                                                                     @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlaybookSummaryResponseDTO> result = playbookService.createPlaybook(createDTO, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updatePlaybook(@RequestBody PlaybookUpdateDTO updateDTO,
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlaybookSummaryResponseDTO> result = playbookService.updatePlaybook(updateDTO, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{playbookId}")
    public ResponseEntity<Void> deletePlaybook(@PathVariable Long playbookId,
                                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        playbookService.deletePlaybook(playbookId, userDetails.getUserId());

        return ResponseEntity.noContent().build();
    }
}
