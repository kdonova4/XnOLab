package com.xno.xno_backend.services;

import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetCreateDTO;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaySheetSituationCreateDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetDetailResponseDTO;
import com.xno.xno_backend.models.DTOs.ResponseDTOs.PlaySheetSummaryResponseDTO;
import com.xno.xno_backend.models.DTOs.UpdateDTOs.PlaySheetUpdateDTO;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaySheetServiceImpl implements PlaySheetService {

    private final PlaySheetRepository playSheetRepository;

    public PlaySheetServiceImpl(PlaySheetRepository playSheetRepository) {
        this.playSheetRepository = playSheetRepository;
    }


    @Override
    public PlaySheetSummaryResponseDTO getPlaySheetSummaryById(Long playSheetId, Long userId) {
        return null;
    }

    @Override
    public PlaySheetDetailResponseDTO loadPlaySheetDetailsById(Long playSheetId, Long userId) {
        return null;
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> searchPlaySheetByName(String name, Long userId) {
        return List.of();
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByUser(Long userId) {
        return List.of();
    }

    @Override
    public List<PlaySheetSummaryResponseDTO> getPlaySheetByPlaybook(Long playbookId, Long userId) {
        return List.of();
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> createPlaySheet(PlaySheetCreateDTO playSheetCreateDTO, Long userId) {

        // Validate DTO
        // Validate Playbook, User...

        // if successful
        // Create PlaySheet
        // Loop Through each situation and create it and assign its PlaySheet to the one created above
        // Also loop through each situation's playIds list, get the Play from that ID
        // Then create the PlaySheetSituationPlay and assign the play ID and the situation ID accordingly
        // Add this PlaySheetSituationPlay to the current created situation's plays list then move on to the next play ID
        // once finished with a situation, add it to the PlaySheet's situations list


        // Save PlaySheet
        // Convert saved PlaySheet into a SummaryDTO
        // Set result payload
        // return result

        return null;
    }

    @Override
    public Result<PlaySheetSummaryResponseDTO> updatePlaySheet(PlaySheetUpdateDTO playSheetUpdateDTO, Long playSheetId, Long userId) {

        // Validate DTO

        // if successful
        // fetch existing PlaySheet
        // Update PlaySheet fields
        // Convert the List of PlaySheetSituations from PlaySheet to a Map of (SituationId, PlaySheetSituation)

        // Loop through the playSheetUpdateDTO situations
        //  -> if the playSheetSituationId is null, create the situation and add it to the situation list for the existing PlaySheet, assign the PlaySheet to the situation
        //  -> else, meaning the situation has an ID, get the playSheetSituation and update it
        //  -> Add these situations, incoming situations, to a set of incoming IDs
        //  -> then using .removeIf(), remove the situations from the existing PlaySheet situations list that don't match with the incoming IDs

        //  -> For the PlaySheetSituation plays, if the situation is null, For each id, find the Play id, and situation and create the SituationPlay
        //  -> Add them to the situationPlay list and then add the whole situation to the Existing PlaySheet

        //  -> If the situation does exist, create a set of ids from the existing situation, compare then using .removeAll() with the dto set of IDs
        //  -> For removing it is existing - incoming [1,2,3] - [3,4,5] = removing [1,2]
        //  -> For Adding its incoming - existing = [1,6,3,2] - [4,2,3,8,5] = adding [1,6]
        //  -> Loop through add set and create each PlaySheetSituationPlay, assign the Play and Situation for each then add to situation plays list
        //  -> Use .removeIf() to remove the contained removed ids in the situations plays list;

        // Save PlaySheet
        // Convert Saved PlaySheet into a Summary DTO
        // Set result payload
        // Return result

        return null;
    }

    @Override
    public void deletePlaySheet(Long playSheetId, Long userId) {

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
            }
        }

        return result;
    }
}
