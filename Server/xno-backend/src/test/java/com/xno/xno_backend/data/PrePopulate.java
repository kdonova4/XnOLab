package com.xno.xno_backend.data;

import com.xno.xno_backend.models.*;
import com.xno.xno_backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class PrePopulate {

    @Autowired
    private PlaybookRepository playbookRepository;

    @Autowired
    private PlayRepository playRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private PlaySheetRepository playSheetRepository;

    @Autowired
    private PlaySheetSituationRepository playSheetSituationRepository;

    @Autowired
    private PlaySheetSituationPlayRepository playSheetSituationPlayRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AppRoleRepository appRoleRepository;

    public void populate() {
        AppRole role = new AppRole(Role.ROLE_USER);
        appRoleRepository.save(role);

        AppUser user = new AppUser("kdonova4", "kdonova4@gmail.com",
                "password1234", false, Set.of(role));
        appUserRepository.save(user);

        Playbook playbook = new Playbook("playbook1", user);
        playbookRepository.save(playbook);

        Formation formation = new Formation("formation1", "url", user);
        formationRepository.save(formation);

        Play play1 = new Play("play1", "url1", "notes", user, playbook, formation);
        Play play2 = new Play("play2", "url2", "notes", user, playbook, formation);
        Play play3 = new Play("play3", "url3", "notes", user, playbook, formation);

        playRepository.save(play1);
        playRepository.save(play2);
        playRepository.save(play3);



        PlaySheet playSheet = new PlaySheet("playsheet1", Timestamp.valueOf(LocalDateTime.now()),
                null, user, playbook);
        playSheetRepository.save(playSheet);

        PlaySheetSituation playSheetSituation1 = new PlaySheetSituation("situation1", "blue", playSheet);
        PlaySheetSituation playSheetSituation2 = new PlaySheetSituation("situation2", "green", playSheet);
        playSheetSituationRepository.save(playSheetSituation1);
        playSheetSituationRepository.save(playSheetSituation2);


        PlaySheetSituationPlay playSheetSituationPlay1 = new PlaySheetSituationPlay(playSheetSituation1, play1);
        PlaySheetSituationPlay playSheetSituationPlay2 = new PlaySheetSituationPlay(playSheetSituation1, play2);
        PlaySheetSituationPlay playSheetSituationPlay3 = new PlaySheetSituationPlay(playSheetSituation2, play3);
        playSheetSituationPlayRepository.save(playSheetSituationPlay1);
        playSheetSituationPlayRepository.save(playSheetSituationPlay2);
        playSheetSituationPlayRepository.save(playSheetSituationPlay3);

    }
}
