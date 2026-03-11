package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.GenerationDetails;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.services.PlaySheetService;
import com.xno.xno_backend.services.PlaySheetServiceImpl;
import com.xno.xno_backend.services.Result;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playsheets")
public class PlaySheetController {

    private final PlaySheetService playSheetService;

    public PlaySheetController(PlaySheetService playSheetService) {
        this.playSheetService = playSheetService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<PlaySheetSummaryResponseDTO>> getPlaySheetsByUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlaySheetSummaryResponseDTO> responseDTOS = playSheetService.getPlaySheetByUser(userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/playbook/{playbookId}")
    public ResponseEntity<List<PlaySheetSummaryResponseDTO>> getPlaySheetsByPlaybook(@PathVariable Long playbookId,
                                                                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlaySheetSummaryResponseDTO> responseDTOS = playSheetService.getPlaySheetByPlaybook(playbookId, userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/search/{playSheetName}")
    public ResponseEntity<List<PlaySheetSummaryResponseDTO>> searchByPlaySheetName(@PathVariable String playSheetName,
                                                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<PlaySheetSummaryResponseDTO> responseDTOS = playSheetService.searchPlaySheetByName(playSheetName, userDetails.getUserId());

        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/playsheet/details/{playSheetId}")
    public ResponseEntity<PlaySheetDetailResponseDTO> getPlaySheetDetailsById(@PathVariable Long playSheetId,
                                                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {
        PlaySheetDetailResponseDTO responseDTO = playSheetService.loadPlaySheetDetailsById(playSheetId, userDetails.getUserId());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/playsheet/summary/{playSheetId}")
    public ResponseEntity<PlaySheetSummaryResponseDTO> getPlaySheetSummaryById(@PathVariable Long playSheetId,
                                                                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        PlaySheetSummaryResponseDTO responseDTO = playSheetService.getPlaySheetSummaryById(playSheetId, userDetails.getUserId());

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    public ResponseEntity<?> createPlaySheet(@RequestBody PlaySheetCreateDTO createDTO,
                                                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlaySheetSummaryResponseDTO> result = playSheetService.createPlaySheet(createDTO, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updatePlaySheet(@RequestBody PlaySheetUpdateDTO updateDTO,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Result<PlaySheetSummaryResponseDTO> result = playSheetService.updatePlaySheet(updateDTO, userDetails.getUserId());

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{playSheetId}")
    public ResponseEntity<Void> deletePlaySheet(@PathVariable Long playSheetId,
                                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        playSheetService.deletePlaySheet(playSheetId, userDetails.getUserId());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/download/{playSheetId}")
    public ResponseEntity<?> generatePlaySheet(@PathVariable Long playSheetId,
                                                      @AuthenticationPrincipal UserDetailsImpl user,
                                                      @RequestBody GenerationDetails generationDetails) {
        Result<byte[]> result = playSheetService.generatePlaySheet(playSheetId, user.getUserId(), generationDetails);

        if(!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        ByteArrayResource resource = new ByteArrayResource(result.getPayload());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"playsheet.xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(result.getPayload().length)
                .body(resource);
    }

}
