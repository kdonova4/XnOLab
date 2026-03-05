package com.xno.xno_backend.services;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.models.DTOs.GenerationDetails;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class GeneratePlaySheet {
    public static void main(String[] args) {

        AppRole role = new AppRole(Role.ROLE_USER);

        AppUser appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com",
                "password1234", false, Set.of(role));

        Formation shotgun = new Formation(1L, "Shotgun", "url", "id", appUser);
        Formation iForm = new Formation(2L, "I-Formation", "url", "id", appUser);
        Formation singleBack = new Formation(3L, "Singleback", "url", "id", appUser);
        Formation pistol = new Formation(4L, "Pistol", "url", "id", appUser);
        Formation trips = new Formation(5L, "Trips Right", "url", "id", appUser);

        List<Play> plays = List.of(

                new Play(1L, "Inside Zone", "url1", "id", "Zone run middle", appUser, null, shotgun),
                new Play(2L, "Outside Zone", "url2", "id", "Stretch run outside", appUser, null, shotgun),
                new Play(3L, "Read Option Right", "url3", "id", "QB reads DE", appUser, null, shotgun),
                new Play(4L, "Read Option Left", "url4", "id", "QB reads DE backside", appUser, null, shotgun),
                new Play(5L, "QB Draw", "url5", "id", "Delayed QB run", appUser, null, shotgun),
                new Play(6L, "Four Verticals", "url6", "id", "Vertical passing concept", appUser, null, shotgun),
                new Play(7L, "Mesh Concept", "url7", "id", "Crossing routes", appUser, null, shotgun),
                new Play(8L, "Stick Concept", "url8", "id", "Quick game stick", appUser, null, shotgun),
                new Play(9L, "Slants", "url9", "id", "Quick slant concept", appUser, null, shotgun),
                new Play(10L, "HB Screen", "url10", "id", "Running back screen", appUser, null, shotgun),

                new Play(11L, "Power Right", "url11", "id", "Power run strong side", appUser, null, iForm),
                new Play(12L, "Power Left", "url12", "id", "Power run weak side", appUser, null, iForm),
                new Play(13L, "Iso Lead", "url13", "id", "Fullback lead", appUser, null, iForm),
                new Play(14L, "Counter Trey", "url14", "id", "Counter run", appUser, null, iForm),
                new Play(15L, "Play Action Post", "url15", "id", "Deep PA shot", appUser, null, iForm),
                new Play(16L, "Bootleg Right", "url16", "id", "QB rollout", appUser, null, iForm),
                new Play(17L, "Bootleg Left", "url17", "id", "QB naked boot", appUser, null, iForm),
                new Play(18L, "FB Dive", "url18", "id", "Quick dive", appUser, null, iForm),
                new Play(19L, "Stretch Toss", "url19", "id", "Outside toss", appUser, null, iForm),
                new Play(20L, "PA Flood", "url20", "id", "Flood concept", appUser, null, iForm),

                new Play(21L, "Singleback Dive", "url21", "id", "Inside run", appUser, null, singleBack),
                new Play(22L, "Singleback Counter", "url22", "id", "Counter action", appUser, null, singleBack),
                new Play(23L, "PA Crossers", "url23", "id", "Play action cross", appUser, null, singleBack),
                new Play(24L, "Levels Concept", "url24", "id", "Short + intermediate routes", appUser, null, singleBack),
                new Play(25L, "Curl Flats", "url25", "id", "Curl/flat combo", appUser, null, singleBack),
                new Play(26L, "Smash Concept", "url26", "id", "Corner + hitch", appUser, null, singleBack),
                new Play(27L, "HB Toss", "url27", "id", "Outside run", appUser, null, singleBack),
                new Play(28L, "Delay Draw", "url28", "id", "Delayed handoff", appUser, null, singleBack),
                new Play(29L, "TE Seam", "url29", "id", "Tight end vertical seam", appUser, null, singleBack),
                new Play(30L, "Wheel Route", "url30", "id", "RB wheel", appUser, null, singleBack),

                new Play(31L, "Pistol Inside Zone", "url31", "id", "Zone run pistol", appUser, null, pistol),
                new Play(32L, "Pistol Power", "url32", "id", "Power pistol", appUser, null, pistol),
                new Play(33L, "Pistol Read Option", "url33", "id", "Read option pistol", appUser, null, pistol),
                new Play(34L, "Pistol Play Action", "url34", "id", "PA pistol", appUser, null, pistol),
                new Play(35L, "QB Sweep", "url35", "id", "Designed QB run", appUser, null, pistol),
                new Play(36L, "Slot Fade", "url36", "id", "Fade from slot", appUser, null, pistol),
                new Play(37L, "Bubble Screen", "url37", "id", "Quick WR screen", appUser, null, pistol),
                new Play(38L, "Middle Screen", "url38", "id", "TE screen", appUser, null, pistol),
                new Play(39L, "Dagger Concept", "url39", "id", "Clear out + dig", appUser, null, pistol),
                new Play(40L, "Drive Concept", "url40", "id", "Shallow cross", appUser, null, pistol),

                new Play(41L, "Trips Verticals", "url41", "id", "4 verts trips", appUser, null, trips),
                new Play(42L, "Trips Flood", "url42", "id", "Flood trips side", appUser, null, trips),
                new Play(43L, "Trips Screen", "url43", "id", "Trips WR screen", appUser, null, trips),
                new Play(44L, "Trips RPO Slant", "url44", "id", "RPO slant", appUser, null, trips),
                new Play(45L, "Trips RPO Bubble", "url45", "id", "RPO bubble", appUser, null, trips),
                new Play(46L, "Trips Levels", "url46", "id", "Levels trips", appUser, null, trips),
                new Play(47L, "Trips Y Cross", "url47", "id", "Y cross concept", appUser, null, trips),
                new Play(48L, "Trips Smash", "url48", "id", "Smash trips", appUser, null, trips),
                new Play(49L, "Trips Mesh", "url49", "id", "Mesh trips", appUser, null, trips),
                new Play(50L, "Trips HB Draw", "url50", "id", "Draw from trips", appUser, null, trips)

        );

        Playbook playbook = new Playbook(1L, "West Coast Offense", appUser, new ArrayList<>());

        plays.forEach(play -> play.setPlaybook(playbook));
        playbook.getPlays().addAll(plays);



        PlaySheet playSheet = new PlaySheet(1L, "Week 1", Timestamp.valueOf(LocalDateTime.now()),
                null, appUser, playbook, new HashSet<>());

        PlaySheetSituation situation1 =
                new PlaySheetSituation(1L, "Opening Script (First 15)", "blue", playSheet, new HashSet<>());

        PlaySheetSituation situation2 =
                new PlaySheetSituation(2L, "1st & 10 - Normal Field Zone", "green", playSheet, new HashSet<>());

        PlaySheetSituation situation3 =
                new PlaySheetSituation(3L, "2nd & Medium (4-6)", "yellow", playSheet, new HashSet<>());

        PlaySheetSituation situation4 =
                new PlaySheetSituation(4L, "3rd & Short (1-3)", "orange", playSheet, new HashSet<>());

        PlaySheetSituation situation5 =
                new PlaySheetSituation(5L, "3rd & Long (7+)", "red", playSheet, new HashSet<>());

        PlaySheetSituation situation6 =
                new PlaySheetSituation(6L, "Low Red Zone (Inside 10)", "purple", playSheet, new HashSet<>());

        PlaySheetSituation situation7 =
                new PlaySheetSituation(7L, "High Red Zone (10-20)", "pink", playSheet, new HashSet<>());

        PlaySheetSituation situation8 =
                new PlaySheetSituation(8L, "Backed Up (Inside Own 10)", "gray", playSheet, new HashSet<>());

        PlaySheetSituation situation9 =
                new PlaySheetSituation(9L, "Two-Minute Drill", "black", playSheet, new HashSet<>());

        PlaySheetSituation situation10 =
                new PlaySheetSituation(10L, "Goal Line (Inside 5)", "gold", playSheet, new HashSet<>());


        playSheet.getSituations().addAll(Set.of(situation1, situation2,
                situation3, situation4, situation5,
                situation6, situation7, situation8,
                situation9, situation10));


        List<PlaySheetSituationPlay> situationPlays = List.of(

                // -------- Opening Script --------
                new PlaySheetSituationPlay(1L, situation1, plays.get(0)),  // play1
                new PlaySheetSituationPlay(2L, situation1, plays.get(5)),  // play6
                new PlaySheetSituationPlay(3L, situation1, plays.get(10)), // play11
                new PlaySheetSituationPlay(4L, situation1, plays.get(20)), // play21
                new PlaySheetSituationPlay(5L, situation1, plays.get(30)), // play31

                // -------- 1st & 10 --------
                new PlaySheetSituationPlay(6L, situation2, plays.get(0)),  // play1
                new PlaySheetSituationPlay(7L, situation2, plays.get(1)),  // play2
                new PlaySheetSituationPlay(8L, situation2, plays.get(10)), // play11
                new PlaySheetSituationPlay(9L, situation2, plays.get(20)), // play21
                new PlaySheetSituationPlay(10L, situation2, plays.get(30)),// play31

                // -------- 2nd & Medium --------
                new PlaySheetSituationPlay(11L, situation3, plays.get(6)),  // play7
                new PlaySheetSituationPlay(12L, situation3, plays.get(7)),  // play8
                new PlaySheetSituationPlay(13L, situation3, plays.get(23)), // play24
                new PlaySheetSituationPlay(14L, situation3, plays.get(39)), // play40
                new PlaySheetSituationPlay(15L, situation3, plays.get(45)), // play46

                // -------- 3rd & Short --------
                new PlaySheetSituationPlay(16L, situation4, plays.get(12)), // play13
                new PlaySheetSituationPlay(17L, situation4, plays.get(13)), // play14
                new PlaySheetSituationPlay(18L, situation4, plays.get(17)), // play18
                new PlaySheetSituationPlay(19L, situation4, plays.get(26)), // play27
                new PlaySheetSituationPlay(20L, situation4, plays.get(31)), // play32

                // -------- 3rd & Long --------
                new PlaySheetSituationPlay(21L, situation5, plays.get(5)),  // play6
                new PlaySheetSituationPlay(22L, situation5, plays.get(38)), // play39
                new PlaySheetSituationPlay(23L, situation5, plays.get(40)), // play41
                new PlaySheetSituationPlay(24L, situation5, plays.get(46)), // play47
                new PlaySheetSituationPlay(25L, situation5, plays.get(48)), // play49

                // -------- Low Red Zone --------
                new PlaySheetSituationPlay(26L, situation6, plays.get(12)), // play13
                new PlaySheetSituationPlay(27L, situation6, plays.get(17)), // play18
                new PlaySheetSituationPlay(28L, situation6, plays.get(34)), // play35
                new PlaySheetSituationPlay(29L, situation6, plays.get(49)), // play50

                // -------- High Red Zone --------
                new PlaySheetSituationPlay(30L, situation7, plays.get(14)), // play15
                new PlaySheetSituationPlay(31L, situation7, plays.get(19)), // play20
                new PlaySheetSituationPlay(32L, situation7, plays.get(32)), // play33
                new PlaySheetSituationPlay(33L, situation7, plays.get(43)), // play44
                new PlaySheetSituationPlay(34L, situation7, plays.get(47)), // play48

                // -------- Backed Up --------
                new PlaySheetSituationPlay(35L, situation8, plays.get(0)),  // play1
                new PlaySheetSituationPlay(36L, situation8, plays.get(12)), // play13
                new PlaySheetSituationPlay(37L, situation8, plays.get(20)), // play21
                new PlaySheetSituationPlay(38L, situation8, plays.get(30)), // play31

                // -------- Two-Minute Drill --------
                new PlaySheetSituationPlay(39L, situation9, plays.get(5)),  // play6
                new PlaySheetSituationPlay(40L, situation9, plays.get(6)),  // play7
                new PlaySheetSituationPlay(41L, situation9, plays.get(23)), // play24
                new PlaySheetSituationPlay(42L, situation9, plays.get(40)), // play41
                new PlaySheetSituationPlay(43L, situation9, plays.get(45)), // play46

                // -------- Goal Line --------
                new PlaySheetSituationPlay(44L, situation10, plays.get(17)), // play18
                new PlaySheetSituationPlay(45L, situation10, plays.get(12)), // play13
                new PlaySheetSituationPlay(46L, situation10, plays.get(34))  // play35

        );


        situation1.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation1))
                .collect(Collectors.toSet()));
        situation2.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation2))
                .collect(Collectors.toSet()));
        situation3.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation3))
                .collect(Collectors.toSet()));
        situation4.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation4))
                .collect(Collectors.toSet()));
        situation5.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation5))
                .collect(Collectors.toSet()));
        situation6.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation6))
                .collect(Collectors.toSet()));
        situation7.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation7))
                .collect(Collectors.toSet()));
        situation8.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation8))
                .collect(Collectors.toSet()));
        situation9.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation9))
                .collect(Collectors.toSet()));
        situation10.getPlays().addAll(situationPlays.stream()
                .filter(play -> play.getPlaySheetSituation().equals(situation10))
                .collect(Collectors.toSet()));


        Result<byte[]> result = generatePlaySheet(playSheet);

        try{
            if(result.isSuccess()) {
                Path path = Paths.get("testoutput/test-file.xlsx");

                Files.createDirectories(path.getParent());

                Files.write(path, result.getPayload());
            }
        } catch (IOException e) {
            System.out.println("Problem");
        }


        System.out.println("hello");
    }

    public static Result<byte[]> generatePlaySheet(GenerationDetails generationDetails, PlaySheet playSheet) {
        Result<byte[]> result = new Result<>();
        // service logic
//        Optional<PlaySheet> optionalPlaySheet = playSheetRepository.findById(playSheetId);
//
//        if(optionalPlaySheet.isEmpty()) {
//            result.addMessages("PlaySheet not found with ID " + playSheetId, ResultType.NOT_FOUND);
//            return result;
//        }
//
//        // fetch existing PlaySheet
//        PlaySheet playSheet = optionalPlaySheet.get();
//
//        if(!playSheet.getUser().getAppUserId().equals(userId)) {
//            result.addMessages("User does not own this PlaySheet", ResultType.FORBIDDEN);
//            return result;
//        }

        // C

        int maxRows = generationDetails.getMaxRows();


        try(Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()){

            Sheet sheet = workbook.createSheet("Call Sheet");

            Row row = sheet.createRow(0);
            Cell column = row.createCell(1);
            column.setCellValue("Hello");



            // Loop through the situation list from playSheet
                // for each situation merge the cells and change the name and color
                // If wrapPlays is false, be sure to check whether # of plays is greater than maxRow - current row
                // if yes, increment column and reset rowNum
                // if row == 0 and plays list is bigger than max row, return error
                // now that the situation name is entered and merged and auto sized, move to the next row
                // Loop through each of the situations plays
                    // Enter the formations name for the first cell, then move over to the next column and enter the play name
                    // make sure to auto size each cell
                    // make sure to be adding to row
                    // make sure to check whether the row number is the over the max or not
                    // if the row number is over the max, increment the column number and reset the row num. ONLY IF wrapPlays IS TRUE







            workbook.write(out);


            result.setPayload(out.toByteArray());
            return result;
        } catch (IOException e) {

        }




        return null;
    }
}
