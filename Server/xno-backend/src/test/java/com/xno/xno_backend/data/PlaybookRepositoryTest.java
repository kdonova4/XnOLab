package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Optional;

@DataJpaTest
@Import(PrePopulate.class)
public class PlaybookRepositoryTest {

    @Autowired
    PrePopulate prePopulate;

    @Autowired
    PlaybookRepository playbookRepository;

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void shouldFindByPlaybookName() {
        Optional<Playbook> playbook = playbookRepository.findByPlaybookName("playbook1");
        assertTrue(playbook.isPresent());
    }

    @Test
    void shouldFindByUserId() {
        Optional<AppUser> user = appUserRepository.findByUsername("kdonova4");
        List<Playbook> playbooks = playbookRepository.findByUser_AppUserId(user.get().getAppUserId());
        assertEquals(1, playbooks.size());
    }

    @Test
    void shouldSearchByNameAndUser() {
        Optional<AppUser> user = appUserRepository.findByUsername("kdonova4");
        List<Playbook> playbooks = playbookRepository.findByPlaybookNameContainingIgnoreCaseAndUser_AppUserId("play", user.get().getAppUserId());
        assertEquals(1, playbooks.size());
    }

    @Test
    @Transactional
    void shouldLoadFullPlaybook() {
        Optional<AppUser> user = appUserRepository.findByUsername("kdonova4");
        List<Playbook> playbooks = playbookRepository.loadPlaybookByUser(user.get().getAppUserId());
        assertEquals(3, playbooks.get(0).getPlays().size());
    }
}
