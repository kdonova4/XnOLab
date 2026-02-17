package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.PlaySheet;
import com.xno.xno_backend.models.PlaySheetSituation;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import jakarta.persistence.EntityManager;
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
public class PlaySheetRepositoryTest {

    @Autowired
    PlaySheetRepository playSheetRepository;

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    PlaybookRepository playbookRepository;

    @Autowired
    PrePopulate prePopulate;

    @Autowired
    EntityManager entityManager;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void shouldFindByName() {
        Optional<PlaySheet> playSheet = playSheetRepository.findByPlaySheetName("playsheet1");
        assertTrue(playSheet.isPresent());
    }

    @Test
    void shouldSearchByNameAndUser() {
        Optional<AppUser> user = appUserRepository.findByUsername("kdonova4");
        List<PlaySheet> playSheets = playSheetRepository.findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId("play", user.get().getAppUserId());
        assertEquals(1, playSheets.size());
    }

    @Test
    void shouldFindByUserId() {
        Optional<AppUser> user = appUserRepository.findByUsername("kdonova4");
        List<PlaySheet> playSheets = playSheetRepository.findByUser_AppUserId(user.get().getAppUserId());
        assertEquals(1, playSheets.size());
    }

    @Test
    void shouldFindByPlaybookId() {
        Optional<Playbook> playbook = playbookRepository.findByPlaybookName("playbook1");
        List<PlaySheet> playSheets = playSheetRepository.findByUser_AppUserId(playbook.get().getPlaybookId());
        assertEquals(1, playSheets.size());
    }

    @Test
    void shouldLoadFullPlaySheet() {
        Optional<PlaySheet> playSheet = playSheetRepository.findByPlaySheetName("playsheet1");
        Optional<PlaySheet> fullPlaySheet = playSheetRepository.loadPlaySheetById(playSheet.get().getPlaySheetId());
        List<PlaySheetSituation> playSheetSituations = fullPlaySheet.get().getSituations().stream().toList();
        assertEquals(2, playSheetSituations.size());
        assertFalse(playSheetSituations.getFirst().getPlays().isEmpty());
    }
}
