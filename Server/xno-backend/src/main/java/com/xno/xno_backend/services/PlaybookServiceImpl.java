package com.xno.xno_backend.services;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.FormationResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlayResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaybookSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaybookUpdateDTO;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class PlaybookServiceImpl implements PlaybookService{

    private final PlaybookRepository playbookRepository;
    private final AppUserRepository appUserRepository;

    public PlaybookServiceImpl(PlaybookRepository playbookRepository, AppUserRepository appUserRepository) {
        this.playbookRepository = playbookRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public PlaybookDetailResponseDTO getPlaybookDetails(Long playbookId, Long userId) {
        Playbook fullPlaybook = playbookRepository.loadPlaybookByPlaybookId(playbookId, userId).orElseThrow(
                () -> new NoSuchElementException("Playbook Not Found With ID " + playbookId)
        );

        List<PlayResponseDTO> playResponseDTOS = fullPlaybook.getPlays().stream()
                .map(play -> new PlayResponseDTO(
                        play.getPlayId(),
                        play.getPlayName(),
                        play.getPlayImageUrl(),
                        play.getNotes(),
                        new FormationResponseDTO(play.getFormation().getFormationId(),
                                play.getFormation().getFormationName(), play.getFormation().getFormationImageUrl())
                )).toList();

        PlaybookDetailResponseDTO playbookDetailResponseDTO = new PlaybookDetailResponseDTO(fullPlaybook.getPlaybookId(),
                fullPlaybook.getPlaybookName(), playResponseDTOS);

        return playbookDetailResponseDTO;
    }

    @Override
    public List<PlaybookSummaryResponseDTO> getAllPlaybooksByUser(Long userId) {

        List<Playbook> playbooks = playbookRepository.findByUser_AppUserId(userId);

        // REFACTOR TO MAPPER CLASS!!!!
        List<PlaybookSummaryResponseDTO> responses = playbooks.stream()
                .map(playbook -> new PlaybookSummaryResponseDTO(playbook.getPlaybookId(), playbook.getPlaybookName()))
                .toList();

        return responses;
    }

    @Override
    public Result<PlaybookSummaryResponseDTO> createPlaybook(PlaybookCreateDTO playbookCreateDTO, Long userId) {
        Result<PlaybookSummaryResponseDTO> result = validateCreate(playbookCreateDTO, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Optional<AppUser> optional = appUserRepository.findById(userId);

        if(optional.isEmpty()) {
            result.addMessages("User with ID " + userId + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        AppUser appUser = optional.get();

        Playbook playbook = new Playbook(playbookCreateDTO.getPlaybookName(), appUser);

        Playbook savedPlaybook = playbookRepository.save(playbook);
        PlaybookSummaryResponseDTO playbookSummaryResponseDTO = new PlaybookSummaryResponseDTO(savedPlaybook.getPlaybookId(), savedPlaybook.getPlaybookName());
        result.setPayload(playbookSummaryResponseDTO);

        return result;
    }

    @Override
    public Result<PlaybookSummaryResponseDTO> updatePlaybook(PlaybookUpdateDTO playbookUpdateDTO, Long userId) {
        Result<PlaybookSummaryResponseDTO> result = validateUpdate(playbookUpdateDTO, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Optional<Playbook> optional = playbookRepository.findByPlaybookIdAndUser_AppUserId(playbookUpdateDTO.getPlaybookId(), userId);

        if(optional.isEmpty()) {
            result.addMessages("Playbook With ID " + playbookUpdateDTO.getPlaybookId() + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        Playbook existing = optional.get();

        existing.setPlaybookName(playbookUpdateDTO.getPlaybookName());

        Playbook updatedPlaybook = playbookRepository.save(existing);
        PlaybookSummaryResponseDTO playbookSummaryResponseDTO = new PlaybookSummaryResponseDTO(updatedPlaybook.getPlaybookId(), updatedPlaybook.getPlaybookName());
        result.setPayload(playbookSummaryResponseDTO);

        return result;
    }

    @Override
    public void deletePlaybook(Long playbookId, Long userId) {
        playbookRepository.deleteByPlaybookIdAndUser_AppUserId(playbookId, userId);
    }

    private Result<PlaybookSummaryResponseDTO> validateCreate(PlaybookCreateDTO playbookCreateDTO, Long userId) {
        Result<PlaybookSummaryResponseDTO> result = new Result<>();

        if(playbookCreateDTO == null) {
            result.addMessages("Playbook cannot be null", ResultType.INVALID);
            return result;
        }

        String name = playbookCreateDTO.getPlaybookName();
        if(name == null || name.isBlank()) {
            result.addMessages("Playbook name cannot be null or blank", ResultType.INVALID);
            return result;
        }

        if(userId == null || !appUserRepository.existsById(userId)) {
            result.addMessages("User must exist", ResultType.INVALID);
            return result;
        }

        if(playbookRepository.existsByUser_AppUserIdAndPlaybookName(userId, playbookCreateDTO.getPlaybookName())) {
            result.addMessages("Cannot duplicate playbook names", ResultType.INVALID);
            return result;
        }

        return result;
    }

    private Result<PlaybookSummaryResponseDTO> validateUpdate(PlaybookUpdateDTO playbookUpdateDTO, Long userId) {
        Result<PlaybookSummaryResponseDTO> result = new Result<>();

        if(playbookUpdateDTO == null) {
            result.addMessages("Playbook Update cannot be null", ResultType.INVALID);
            return result;
        }

        if(playbookUpdateDTO.getPlaybookId() == null) {
            result.addMessages("Playbook ID cannot be null", ResultType.INVALID);
            return result;
        }

        if(userId == null || !appUserRepository.existsById(userId)) {
            result.addMessages("User must exist", ResultType.INVALID);
            return result;
        }

        String name = playbookUpdateDTO.getPlaybookName();
        if(name == null || name.isBlank()) {
            result.addMessages("Playbook name cannot be null or blank", ResultType.INVALID);
        }

        if(playbookRepository.existsByUser_AppUserIdAndPlaybookNameAndPlaybookIdNot(userId, playbookUpdateDTO.getPlaybookName(), playbookUpdateDTO.getPlaybookId())) {
            result.addMessages("Playbook name cannot be duplicated among a users playbooks", ResultType.INVALID);
            return result;
        }

        return result;
    }

}
