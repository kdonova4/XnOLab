package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(PrePopulate.class)
public class AppUserRepositoryTest {

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    PrePopulate prePopulate;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }

    @Test
    void shouldFindByUsername() {
        Optional<AppUser> appUser = appUserRepository.findByUsername("kdonova4");
        assertTrue(appUser.isPresent());
    }

    @Test
    void shouldExistByEmail() {
        assertTrue(appUserRepository.existsByEmail("kdonova4@gmail.com"));
    }

    @Test
    void shouldExistByUsername() {
        assertTrue(appUserRepository.existsByUsername("kdonova4"));
    }
}
