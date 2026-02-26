package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.models.Play;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

@DataJpaTest
@Import(PrePopulate.class)
public class PlayRepositoryTest {

    @Autowired
    PlayRepository playRepository;

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    PlaybookRepository playbookRepository;

    @Autowired
    FormationRepository formationRepository;

    @Autowired
    PrePopulate prePopulate;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }

    @Test
    void shouldFindByPlayName() {
        Optional<Play> play = playRepository.findByPlayName("play1");
        assertTrue(play.isPresent());
    }

    @Test
    void shouldSearchByPlayNameAndUser() {
        Optional<AppUser> appUser = appUserRepository.findByUsername("kdonova4");
        List<Play> plays = playRepository.findByPlayNameContainingIgnoreCaseAndUser_AppUserId("play", appUser.get().getAppUserId());
        assertEquals(3, plays.size());
    }

    @Test
    void shouldFindByFormation() {
        Optional<Formation> formation = formationRepository.findByFormationName("formation1");
        List<Play> plays = playRepository.findByFormation_FormationId(formation.get().getFormationId());
        assertEquals(3, plays.size());
    }

    @Test
    void shouldFindByPlaybookAndUser() {
        Optional<AppUser> appUser = appUserRepository.findByUsername("kdonova4");
        Optional<Playbook> playbook = playbookRepository.findByPlaybookName("playbook1");
        List<Play> plays = playRepository.findByPlaybook_PlaybookIdAndPlaybook_User_AppUserId(playbook.get().getPlaybookId(), appUser.get().getAppUserId());
        assertEquals(3, plays.size());
    }
}
