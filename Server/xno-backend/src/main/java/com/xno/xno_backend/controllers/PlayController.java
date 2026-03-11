package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.services.PlayService;
import com.xno.xno_backend.services.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/plays")
public class PlayController {

    private final PlayService playService;

    public PlayController(PlayService playService) {
        this.playService = playService;
    }

    @GetMapping("/search/{playName}")
    public ResponseEntity<List<PlayResponseDTO>> searchPlaysByName(@PathVariable String playName,
                                                                   @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlayResponseDTO> playResponseDTOS = playService.searchPlaysByName(playName, userDetails.getUserId());

        return ResponseEntity.ok(playResponseDTOS);
    }

    @GetMapping("/playbook/{playbookId}")
    public ResponseEntity<List<PlayResponseDTO>> getPlaysByPlaybook(@PathVariable Long playbookId,
                                                                    @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlayResponseDTO> playResponseDTOS = playService.getPlaysByPlaybook(playbookId, userDetails.getUserId());

        return ResponseEntity.ok(playResponseDTOS);
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<PlayResponseDTO>> getPlaysByFormation(@PathVariable Long formationId,
                                                                     @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlayResponseDTO> playResponseDTOS = playService.getPlaysByFormation(formationId, userDetails.getUserId());

        return ResponseEntity.ok(playResponseDTOS);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPlay(@ModelAttribute PlayCreateDTO createDTO,
                                                      @RequestParam("file")MultipartFile file,
                                                      @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlayResponseDTO> result = playService.createPlay(createDTO, file, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePlay(@ModelAttribute PlayUpdateDTO updateDTO,
                                        @RequestParam("file") MultipartFile file,
                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlayResponseDTO> result = playService.updatePlay(updateDTO, file, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{playId}")
    public ResponseEntity<Void> deletePlay(@PathVariable Long playId,
                                           @AuthenticationPrincipal UserDetailsImpl userDetails) {
        playService.deletePlay(playId, userDetails.getUserId());

        return ResponseEntity.noContent().build();
    }
}
