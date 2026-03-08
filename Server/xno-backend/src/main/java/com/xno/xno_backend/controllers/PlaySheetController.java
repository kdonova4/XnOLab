package com.xno.xno_backend.controllers;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.GenerationDetails;
import com.xno.xno_backend.models.UserDetailsImpl;
import com.xno.xno_backend.services.PlaySheetService;
import com.xno.xno_backend.services.PlaySheetServiceImpl;
import com.xno.xno_backend.services.Result;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playsheet")
public class PlaySheetController {

    private final PlaySheetService playSheetService;

    public PlaySheetController(PlaySheetService playSheetService) {
        this.playSheetService = playSheetService;
    }

    @PostMapping("/download/{playSheetId}")
    public ResponseEntity<?> generatePlaySheet(@PathVariable Long playSheetId,
                                                      @AuthenticationPrincipal UserDetailsImpl user,
                                                      @RequestBody GenerationDetails generationDetails) {
        Result<byte[]> result = playSheetService.generatePlaySheet(playSheetId, user.getUserId(), generationDetails);

        if(!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getMessages());
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
