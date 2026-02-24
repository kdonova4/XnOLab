package com.xno.xno_backend.services;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlayCreateDTO;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.models.Play;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlayServiceImpl implements PlayService {

    private final PlayRepository playRepository;
    private final FormationRepository formationRepository;
    private final PlaybookRepository playbookRepository;
    private final AppUserRepository appUserRepository;
    private final CloudinaryImageService imageService;

    public PlayServiceImpl(PlayRepository playRepository, FormationRepository formationRepository, PlaybookRepository playbookRepository, AppUserRepository appUserRepository, CloudinaryImageService imageService) {
        this.playRepository = playRepository;
        this.formationRepository = formationRepository;
        this.playbookRepository = playbookRepository;
        this.appUserRepository = appUserRepository;
        this.imageService = imageService;
    }

    @Override
    public List<PlayResponseDTO> searchPlaysByName(String name, Long userId) {
        List<Play> plays = playRepository.findByPlayNameContainingIgnoreCaseAndUser_AppUserId(name, userId);

        List<PlayResponseDTO> responseDTOS = plays.stream()
                .map(play -> new PlayResponseDTO(
                        play.getPlayId(),
                        play.getPlayName(),
                        play.getPlayImageUrl(),
                        play.getNotes(),
                        new FormationResponseDTO(
                                play.getFormation().getFormationId(),
                                play.getFormation().getFormationName(),
                                play.getFormation().getFormationImageUrl()
                        )
                )).toList();

        return responseDTOS;
    }

    @Override
    public List<PlayResponseDTO> getPlaysByPlaybook(Long playbookId, Long userId) {
        List<Play> plays = playRepository.findByPlaybook_PlaybookIdAndPlaybook_User_AppUserId(playbookId, userId);

        List<PlayResponseDTO> responseDTOS = plays.stream()
                .map(play -> new PlayResponseDTO(
                        play.getPlayId(),
                        play.getPlayName(),
                        play.getPlayImageUrl(),
                        play.getNotes(),
                        new FormationResponseDTO(
                                play.getFormation().getFormationId(),
                                play.getFormation().getFormationName(),
                                play.getFormation().getFormationImageUrl()
                        )
                )).toList();

        return responseDTOS;
    }

    @Override
    public List<PlayResponseDTO> getPlaysByFormation(Long formationId, Long userId) {
        List<Play> plays = playRepository.findByFormation_FormationIdAndFormation_User_AppUserId(formationId, userId);

        List<PlayResponseDTO> responseDTOS = plays.stream()
                .map(play -> new PlayResponseDTO(
                        play.getPlayId(),
                        play.getPlayName(),
                        play.getPlayImageUrl(),
                        play.getNotes(),
                        new FormationResponseDTO(
                                play.getFormation().getFormationId(),
                                play.getFormation().getFormationName(),
                                play.getFormation().getFormationImageUrl()
                        )
                )).toList();

        return responseDTOS;
    }

    @Override
    public Result<PlayResponseDTO> createPlay(PlayCreateDTO play, MultipartFile file, Long userId) {
        Result<PlayResponseDTO> result = validateCreate(play, file, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Optional<AppUser> optionalUser = appUserRepository.findById(userId);
        Optional<Playbook> optionalPlaybook = playbookRepository.findById(play.getPlaybookId());
        Optional<Formation> optionalFormation = formationRepository.findById(play.getFormationId());

        if(optionalUser.isEmpty()) {
            result.addMessages("User with ID " + userId + " not found", ResultType.NOT_FOUND);
            return result;
        }

        if(optionalPlaybook.isEmpty()) {
            result.addMessages("Playbook with ID " + userId + " not found", ResultType.NOT_FOUND);
            return result;
        }

        if(optionalFormation.isEmpty()) {
            result.addMessages("Formation with ID " + userId + " not found", ResultType.NOT_FOUND);
            return result;
        }

        if(!optionalPlaybook.get().getUser().getAppUserId().equals(userId)) {
            result.addMessages("Playbook does not belong to user", ResultType.FORBIDDEN);
            return result;
        }

        Map uploadResult = imageService.uploadImage(file);

        String playImageUrl = uploadResult.get("secure_url").toString();
        String playPublicId = uploadResult.get("public_id").toString();

        Play newPlay = new Play(play.getPlayName(), playImageUrl, playPublicId, play.getPlayNotes(), optionalUser.get(), optionalPlaybook.get(), optionalFormation.get());

        Play savedPlay = playRepository.save(newPlay);
        PlayResponseDTO playResponseDTO = new PlayResponseDTO(
                savedPlay.getPlayId(), savedPlay.getPlayName(),
                savedPlay.getPlayImageUrl(), savedPlay.getNotes(),
                new FormationResponseDTO(optionalFormation.get().getFormationId(),
                        optionalFormation.get().getFormationName(), optionalFormation.get().getFormationImageUrl())
        );
        result.setPayload(playResponseDTO);
        return result;
    }

    @Override
    public Result<PlayResponseDTO> updatePlay(PlayUpdateDTO playUpdateDTO, MultipartFile file, Long userId) {
        Result<PlayResponseDTO> result = validateUpdate(playUpdateDTO, file, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Optional<Play> optionalPlay = playRepository.findById(playUpdateDTO.getPlayId());

        if(optionalPlay.isEmpty()) {
            result.addMessages("Play with ID " + playUpdateDTO.getPlayId() + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        Play existing = optionalPlay.get();

        if(!existing.getUser().getAppUserId().equals(userId)) {
            result.addMessages("This play does not belong to this user", ResultType.FORBIDDEN);
            return result;
        }

        if(file != null) {
            Map uploadResult = imageService.uploadImage(file);
            String playImageUrl = uploadResult.get("secure_url").toString();
            String playPublicId = uploadResult.get("public_id").toString();

            imageService.deleteImage(existing.getPlayPublicId());

            existing.setPlayImageUrl(playImageUrl);
            existing.setPlayPublicId(playPublicId);
        }

        existing.setPlayName(playUpdateDTO.getPlayName());
        existing.setNotes(playUpdateDTO.getPlayNotes());

        Play savedPlay = playRepository.save(existing);
        PlayResponseDTO playResponseDTO = new PlayResponseDTO(
                savedPlay.getPlayId(),
                savedPlay.getPlayName(),
                savedPlay.getPlayImageUrl(),
                savedPlay.getNotes(),
                new FormationResponseDTO(savedPlay.getFormation().getFormationId(),
                        savedPlay.getFormation().getFormationName(),
                        savedPlay.getFormation().getFormationImageUrl())
        );

        result.setPayload(playResponseDTO);
        return result;
    }

    @Override
    public void deletePlay(Long playId, Long userId) {
        playRepository.deleteByPlayIdAndUser_AppUserId(playId, userId);
    }

    private Result<PlayResponseDTO> validateCreate(PlayCreateDTO playCreateDTO, MultipartFile file, Long userId) {
        Result<PlayResponseDTO> result = new Result<>();

        if(playCreateDTO == null) {
            result.addMessages("Play cannot be null", ResultType.INVALID);
            return result;
        }

        String name = playCreateDTO.getPlayName();
        if(name == null || name.isBlank()) {
            result.addMessages("Play name cannot be null or blank", ResultType.INVALID);
            return result;
        }

        if(file.isEmpty()) {
            result.addMessages("File cannot be empty", ResultType.INVALID);
            return result;
        }

        String notes = playCreateDTO.getPlayNotes();
        if(notes != null) {
            if(notes.length() > 1000) {
                result.addMessages("Notes cannot be over 1000 characters", ResultType.INVALID);
            }
        }

        if(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playCreateDTO.getPlayName(), userId, playCreateDTO.getPlaybookId()).isPresent()) {
            result.addMessages("Play name cannot be duplicated within a playbook", ResultType.INVALID);
            return result;
        }

        return result;
    }

    private Result<PlayResponseDTO> validateUpdate(PlayUpdateDTO playUpdateDTO, MultipartFile file, Long userId) {
        Result<PlayResponseDTO> result = new Result<>();

        if(playUpdateDTO == null) {
            result.addMessages("Play update cannot be null", ResultType.INVALID);
            return result;
        }

        String name = playUpdateDTO.getPlayName();
        if(name == null || name.isBlank()) {
            result.addMessages("Play name cannot be null", ResultType.INVALID);
        }

        if(file == null || file.isEmpty()) {
            result.addMessages("File cannot be null or empty", ResultType.INVALID);
            return result;
        }

        String notes = playUpdateDTO.getPlayNotes();
        if(notes != null) {
            if(notes.length() > 1000) {
                result.addMessages("Notes cannot be over 1000 characters", ResultType.INVALID);
            }
        }

        Optional<Play> optionalPlay = playRepository.findById(playUpdateDTO.getPlayId());
        Play play = new Play();
        if(optionalPlay.isPresent()) {
            play = optionalPlay.get();
        }

        if(playRepository.findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(playUpdateDTO.getPlayName(), userId, play.getPlaybook().getPlaybookId()).isPresent()) {
            result.addMessages("Play name cannot be duplicated within a playbook", ResultType.INVALID);
            return result;
        }

        return result;
    }
}
