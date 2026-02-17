package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.Formation;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.FormationRepository;
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
public class FormationRepositoryTest {

    @Autowired
    FormationRepository formationRepository;

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    PrePopulate prePopulate;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }

    @Test
    void shouldFindByFormationName() {
        Optional<Formation> formation = formationRepository.findByFormationName("formation1");
        assertTrue(formation.isPresent());
    }

    @Test
    void shouldSearchByNameAndUser() {
        Optional<AppUser> appUser = appUserRepository.findByUsername("kdonova4");
        List<Formation> formations = formationRepository.findByFormationNameContainingIgnoreCaseAndUser_AppUserId("form", appUser.get().getAppUserId());
        assertEquals(1, formations.size());
    }

    @Test
    void shouldFindFormationsByUser() {
        Optional<AppUser> appUser = appUserRepository.findByUsername("kdonova4");
        List<Formation> formations = formationRepository.findByUser_AppUserId(appUser.get().getAppUserId());
        assertEquals(1, formations.size());
    }
}
