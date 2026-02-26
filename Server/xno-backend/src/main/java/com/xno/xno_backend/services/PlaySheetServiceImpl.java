package com.xno.xno_backend.services;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetSituationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.*;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetSituationUpdateDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlayUpdateDTO;
import com.xno.xno_backend.repositories.*;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PlaySheetServiceImpl implements PlaySheetService {

    private final PlaySheetRepository playSheetRepository;
    private final PlaybookRepository playbookRepository;
    private final AppUserRepository appUserRepository;
    private final PlayRepository playRepository;
    private final PlaySheetSituationRepository playSheetSituationRepository;
    private final PlaySheetSituationPlayRepository playSheetSituationPlayRepository;

    public PlaySheetServiceImpl(PlaySheetRepository playSheetRepository, PlaybookRepository playbookRepository, AppUserRepository appUserRepository, PlayRepository playRepository, PlaySheetSituationRepository playSheetSituationRepository, PlaySheetSituationPlayRepository playSheetSituationPlayRepository) {
        this.playSheetRepository = playSheetRepository;
        this.playbookRepository = playbookRepository;
        this.appUserRepository = appUserRepository;
        this.playRepository = playRepository;
        this.playSheetSituationRepository = playSheetSituationRepository;
        this.playSheetSituationPlayRepository = playSheetSituationPlayRepository;
    }


    @Override
    public PlaySheetSummaryResponseDTO getPlaySheetSummaryById(Long playSheetId, Long userId) {
        PlaySheet playSheet = playSheetRepository.findByPlaySheetIdAndUser_AppUserId(playSheetId, userId)
                .orElseThrow(() -> new NoSuchElementException(String.format("PlaySheet ID %d not found for User %d", playSheetId, userId)));

        PlaySheetSummaryResponseDTO playSheetSummaryResponseDTO =
                new PlaySheetSummaryResponseDTO(
                        playSheet.getPlaySheetId(),
                        playSheet.getPlaySheetName(),
                        playSheet.getCreatedAt(),
                        playSheet.getUpdatedAt(),
                        new PlaybookSummaryResponseDTO(
                                playSheet.getPlaybook().getPlaybookId(),
                                playSheet.getPlaybook().getPlaybookName()
                        )
                );

        return playSheetSummaryResponseDTO;
    }

    @Override
    public PlaySheetDetailResponseDTO loadPlaySheetDetailsById(Long playSheetId, Long userId) {
        PlaySheet playSheet = playSheetRepository.loadPlaySheetByPlaySheetIdAndUserId(playSheetId, userId).orElseThrow(
                () -> new NoSuchElementException(String.format("PlaySheet ID %d not found for User %d", playSheetId, userId))
        );

        PlaySheetDetailResponseDTO detailResponseDTO = new PlaySheetDetailResponseDTO(
                playSheet.getPlaySheetId(),
                playSheet.getPlaySheetName(),
                playSheet.getCreatedAt(),
                playSheet.getUpdatedAt(),
                new PlaybookSummaryResponseDTO(
                        playSheet.getPlaybook().getPlaybookId(),
                        playSheet.getPlaybook().getPlaybookName()
                ),
                playSheet.getSituations().stream().map(
                        situation -> new PlaySheetSituationResponseDTO(
                                situation.getPlaySheetSituationId(),
                                situation.getSituationName(),
                                situation.getSituationColor(),
                                situation.getPlaySheet().getPlaySheetId(),
                                situation.getPlays().stream()
                                        .map(psp -> new PlaySheetSituationPlayResponseDTO(
                                                new PlayResponseDTO(
                                                        psp.getPlay().getPlayId(),
                                                        psp.getPlay().getPlayName(),
                                                        psp.getPlay().getPlayImageUrl(),
                                                        psp.getPlay().getNotes(),
                                                        new FormationResponseDTO(
                                                                psp.getPlay().getFormation().getFormationId(),
                                                                psp.getPlay().getFormation().getFormationName(),
                                                                psp.getPlay().getFormation().getFormationImageUrl()
                                                        )
                                                )
                                        )).toList()
                        )
                ).toList()
        );

        return detailResponseDTO;
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> searchPlaySheetByName(String name, Long userId) {
        List<PlaySheet> playSheets = playSheetRepository.findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId(name, userId);

        List<PlaySheetSummaryResponseDTO> summaryResponseDTOS = playSheets.stream()
                .map(playSheet -> new PlaySheetSummaryResponseDTO(
                        playSheet.getPlaySheetId(),
                        playSheet.getPlaySheetName(),
                        playSheet.getCreatedAt(),
                        playSheet.getUpdatedAt(),
                        new PlaybookSummaryResponseDTO(
                                playSheet.getPlaybook().getPlaybookId(),
                                playSheet.getPlaybook().getPlaybookName()
                        )
                )).toList();

        return summaryResponseDTOS;
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByUser(Long userId) {
        List<PlaySheet> playSheets = playSheetRepository.findByUser_AppUserId(userId);

        List<PlaySheetSummaryResponseDTO> summaryResponseDTOS = playSheets.stream()
                .map(playSheet -> new PlaySheetSummaryResponseDTO(
                        playSheet.getPlaySheetId(),
                        playSheet.getPlaySheetName(),
                        playSheet.getCreatedAt(),
                        playSheet.getUpdatedAt(),
                        new PlaybookSummaryResponseDTO(
                                playSheet.getPlaybook().getPlaybookId(),
                                playSheet.getPlaybook().getPlaybookName()
                        )
                )).toList();

        return summaryResponseDTOS;
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByPlaybook(Long playbookId, Long userId) {
        List<PlaySheet> playSheets = playSheetRepository.findByPlaybook_PlaybookIdAndUser_AppUserId(playbookId, userId);

        List<PlaySheetSummaryResponseDTO> summaryResponseDTOS = playSheets.stream()
                .map(playSheet -> new PlaySheetSummaryResponseDTO(
                        playSheet.getPlaySheetId(),
                        playSheet.getPlaySheetName(),
                        playSheet.getCreatedAt(),
                        playSheet.getUpdatedAt(),
                        new PlaybookSummaryResponseDTO(
                                playSheet.getPlaybook().getPlaybookId(),
                                playSheet.getPlaybook().getPlaybookName()
                        )
                )).toList();

        return summaryResponseDTOS;
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> createPlaySheet(PlaySheetCreateDTO playSheetCreateDTO, Long userId) {

        // Validate DTO
        Result<PlaySheetSummaryResponseDTO> result = validateCreate(playSheetCreateDTO, userId);

        if(!result.isSuccess()) {
            return result;
        }
        // Validate Playbook, User...
        Optional<Playbook> optionalPlaybook = playbookRepository.findById(playSheetCreateDTO.getPlaybookId());

        if(optionalPlaybook.isEmpty()) {
            result.addMessages("Playbook with ID " + playSheetCreateDTO.getPlaybookId() + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        Playbook playbook = optionalPlaybook.get();

        if(!playbook.getUser().getAppUserId().equals(userId)) {
            result.addMessages("User does not own this playbook", ResultType.FORBIDDEN);
            return result;
        }

        Optional<AppUser> optional = appUserRepository.findById(userId);

        if(optional.isEmpty()) {
            result.addMessages("User with ID " + userId + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        AppUser appUser = optional.get();


        PlaySheet playSheet = new PlaySheet(playSheetCreateDTO.getPlaySheetName(),
                Timestamp.valueOf(LocalDateTime.now()), null, appUser, playbook);


        // if successful
        // Create PlaySheet
        // Loop Through each situation and create it and assign its PlaySheet to the one created above
        // Also loop through each situation's playIds list, get the Play from that ID
        // Then create the PlaySheetSituationPlay and assign the play ID and the situation ID accordingly
        // Add this PlaySheetSituationPlay to the current created situation's plays list then move on to the next play ID
        // once finished with a situation, add it to the PlaySheet's situations list
        for(PlaySheetSituationCreateDTO situation : playSheetCreateDTO.getSituations()) {

            PlaySheetSituation playSheetSituation = new PlaySheetSituation(situation.getSituationName(),
                    situation.getSituationColor(), playSheet);

            for(Long id : situation.getPlayIds()) {
                Optional<Play> optionalPlay = playRepository.findById(id);
                if(optionalPlay.isEmpty()) {
                    result.addMessages(String.format("Play with ID %d does not exist for situation %s", id,situation.getSituationName()), ResultType.INVALID);
                    return result;
                }

                Play play = optionalPlay.get();

                PlaySheetSituationPlay playSheetSituationPlay = new PlaySheetSituationPlay(playSheetSituation, play);
                playSheetSituation.getPlays().add(playSheetSituationPlay);
            }

            playSheet.getSituations().add(playSheetSituation);
        }

        // Save PlaySheet
        PlaySheet savedPlaySheet = playSheetRepository.save(playSheet);
        // Convert saved PlaySheet into a SummaryDTO
        PlaySheetSummaryResponseDTO playSheetSummaryResponseDTO = new PlaySheetSummaryResponseDTO(
                savedPlaySheet.getPlaySheetId(),
                savedPlaySheet.getPlaySheetName(),
                savedPlaySheet.getCreatedAt(),
                savedPlaySheet.getUpdatedAt(),
                new PlaybookSummaryResponseDTO(
                        playbook.getPlaybookId(),
                        playbook.getPlaybookName()
                )
        );

        result.setPayload(playSheetSummaryResponseDTO);
        return result;
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> updatePlaySheet(PlaySheetUpdateDTO playSheetUpdateDTO, Long userId) {

        // Validate DTO
        Result<PlaySheetSummaryResponseDTO> result = validateUpdate(playSheetUpdateDTO, userId);

        if(!result.isSuccess()) {
            return result;
        }

        Optional<PlaySheet> optionalPlaySheet = playSheetRepository.findById(playSheetUpdateDTO.getPlaySheetId());

        if(optionalPlaySheet.isEmpty()) {
            result.addMessages("PlaySheet not found with ID " + playSheetUpdateDTO.getPlaySheetId(), ResultType.NOT_FOUND);
            return result;
        }

        // fetch existing PlaySheet
        PlaySheet playSheet = optionalPlaySheet.get();

        if(!playSheet.getUser().getAppUserId().equals(userId)) {
            result.addMessages("User does not own this PlaySheet", ResultType.FORBIDDEN);
            return result;
        }

        playSheet.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        playSheet.setPlaySheetName(playSheetUpdateDTO.getPlaySheetName());

        // Update PlaySheet fields
        // Convert the List of PlaySheetSituations from PlaySheet to a Map of (SituationId, PlaySheetSituation)
        Map<Long, PlaySheetSituation> existingSituations = playSheet.getSituations()
                .stream()
                .collect(Collectors.toMap(
                        PlaySheetSituation::getPlaySheetSituationId,
                        Function.identity()
                ));

        Set<Long> incomingIds = new HashSet<>();

        // Loop through the playSheetUpdateDTO situations
        for(PlaySheetSituationUpdateDTO situation : playSheetUpdateDTO.getSituations()) {
            //  -> if the playSheetSituationId is null, create the situation, assign the PlaySheet to the situation
            if(situation.getPlaySheetSituationId() == null) { // NEW SITUATION
                PlaySheetSituation playSheetSituation = new PlaySheetSituation(
                        situation.getSituationName(),
                        situation.getSituationColor(),
                        playSheet
                );

                //  -> For the PlaySheetSituation plays, if the situation is null, For each id, find the Play id
                //  And situation and create the SituationPlay
                for(Long id : situation.getPlayIds()) {
                    Optional<Play> optionalPlay = playRepository.findById(id);
                    if(optionalPlay.isEmpty()) {
                        result.addMessages(String.format("Play with ID %d does not exist for situation %s", id,situation.getSituationName()), ResultType.NOT_FOUND);
                        return result;
                    }

                    Play play = optionalPlay.get();

                    PlaySheetSituationPlay playSheetSituationPlay = new PlaySheetSituationPlay(playSheetSituation, play);
                    playSheetSituation.getPlays().add(playSheetSituationPlay);
                }

                playSheet.getSituations().add(playSheetSituation);
            } else { // EXISTING SITUATION
                PlaySheetSituation existing = existingSituations.get(situation.getPlaySheetSituationId());

                if(existing == null) {
                    result.addMessages(String.format("Situation with ID %d does not exist for PlaySheet %d", situation.getPlaySheetSituationId(), playSheet.getPlaySheetId()), ResultType.NOT_FOUND);
                    return result;
                }

                existing.setSituationName(situation.getSituationName());
                existing.setSituationColor(situation.getSituationColor());



                // Update PlayLists
                Set<Long> existingIds = existing.getPlays().stream()
                        .map(playSheetSituationPlay -> playSheetSituationPlay.getPlay().getPlayId())
                        .collect(Collectors.toSet());

                // create set from list of incoming situation play ids
                Set<Long> incomingPlayIds = new HashSet<>(situation.getPlayIds());

                // For removing it is existing - incoming [1,2,3] - [3,4,5] = removing [1,2]
                Set<Long> toRemove = new HashSet<>(existingIds);
                toRemove.removeAll(incomingPlayIds);

                // Adding its incoming - existing = [1,6,3,2] - [4,2,3,8,5] = adding [1,6]
                Set<Long> toAdd = new HashSet<>(incomingPlayIds);
                toAdd.removeAll(existingIds);

                // Remove The plays from the existing play list
                existing.getPlays().removeIf(psp -> toRemove.contains(psp.getPlay().getPlayId()));

                // add the plays to the existing plays list
                for(Long id : toAdd) {
                    Optional<Play> optionalPlay = playRepository.findById(id);
                    if(optionalPlay.isEmpty()) {
                        result.addMessages(String.format("Play with ID %d does not exist for situation %s", id,situation.getSituationName()), ResultType.NOT_FOUND);
                        return result;
                    }

                    Play play = optionalPlay.get();
                    PlaySheetSituationPlay playSheetSituationPlay = new PlaySheetSituationPlay(existing, play);
                    existing.getPlays().add(playSheetSituationPlay);
                }

                // Add the incoming situation id to this set to know which situations to remove later
                incomingIds.add(existing.getPlaySheetSituationId());
            }
        }

        // removing any situation that is not new or is not in the incoming situation list
        playSheet.getSituations().removeIf(playSheetSituation ->
            playSheetSituation.getPlaySheetSituationId() != null && !incomingIds.contains(playSheetSituation.getPlaySheetSituationId()));


        // Save PlaySheet
        PlaySheet savedPlaySheet = playSheetRepository.save(playSheet);

        // Convert Saved PlaySheet into a Summary DTO
        PlaySheetSummaryResponseDTO playSheetSummaryResponseDTO = new PlaySheetSummaryResponseDTO(
                savedPlaySheet.getPlaySheetId(),
                savedPlaySheet.getPlaySheetName(),
                savedPlaySheet.getCreatedAt(),
                savedPlaySheet.getUpdatedAt(),
                new PlaybookSummaryResponseDTO(
                        savedPlaySheet.getPlaybook().getPlaybookId(),
                        savedPlaySheet.getPlaybook().getPlaybookName()
                )
        );
        result.setPayload(playSheetSummaryResponseDTO);
        return result;
    }

    @Override
    public void deletePlaySheet(Long playSheetId, Long userId) {
        playSheetRepository.deleteByPlaySheetIdAndUser_AppUserId(playSheetId, userId);
    }

    private Result<PlaySheetSummaryResponseDTO> validateCreate(PlaySheetCreateDTO playSheetCreateDTO, Long userId) {
        Result<PlaySheetSummaryResponseDTO> result = new Result<>();

        if(playSheetCreateDTO == null) {
            result.addMessages("PlaySheet cannot be null", ResultType.INVALID);
            return result;
        }

        String name = playSheetCreateDTO.getPlaySheetName();
        if(name == null || name.isBlank()) {
            result.addMessages("PlaySheet name cannot be null or blank", ResultType.INVALID);
            return result;
        }

        if(playSheetCreateDTO.getSituations().isEmpty()) {
            result.addMessages("Cannot create PlaySheet with 0 situations", ResultType.INVALID);
            return result;
        } else {
            for(PlaySheetSituationCreateDTO situation : playSheetCreateDTO.getSituations()) {
                if(situation.getPlayIds().isEmpty()) {
                    result.addMessages("Cannot have a situation without any plays", ResultType.INVALID);
                    return result;
                }
                if(situation.getSituationName() == null || situation.getSituationName().isBlank()) {
                    result.addMessages("Situation Name cannot be null or blank", ResultType.INVALID);
                    return result;
                }
                if(situation.getSituationColor() == null || situation.getSituationColor().isBlank()) {
                    result.addMessages("Situation Color cannot be null or blank", ResultType.INVALID);
                    return result;
                }
            }
        }

        return result;
    }

    private Result<PlaySheetSummaryResponseDTO> validateUpdate(PlaySheetUpdateDTO playSheetUpdateDTO, Long userId) {
        Result<PlaySheetSummaryResponseDTO> result = new Result<>();

        if(playSheetUpdateDTO == null) {
            result.addMessages("PlaySheet Update cannot be null", ResultType.INVALID);
            return result;
        }

        String name = playSheetUpdateDTO.getPlaySheetName();
        if(name == null || name.isBlank()) {
            result.addMessages("PlaySheet name cannot be null or blank", ResultType.INVALID);
            return result;
        }

        Optional<AppUser> optional = appUserRepository.findById(userId);

        if(optional.isEmpty()) {
            result.addMessages("User with ID " + userId + " Not Found", ResultType.NOT_FOUND);
            return result;
        }

        if(playSheetUpdateDTO.getSituations().isEmpty()) {
            result.addMessages("Cannot create PlaySheet with 0 situations", ResultType.INVALID);
            return result;
        } else {
            for(PlaySheetSituationUpdateDTO situation : playSheetUpdateDTO.getSituations()) {
                if(situation.getPlayIds().isEmpty()) {
                    result.addMessages("Cannot have a situation without any plays", ResultType.INVALID);
                    return result;
                }
                if(situation.getSituationName() == null || situation.getSituationName().isBlank()) {
                    result.addMessages("Situation Name cannot be null or blank", ResultType.INVALID);
                    return result;
                }
                if(situation.getSituationColor() == null || situation.getSituationColor().isBlank()) {
                    result.addMessages("Situation Color cannot be null or blank", ResultType.INVALID);
                    return result;
                }
            }
        }

        return result;
    }
}
