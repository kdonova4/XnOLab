package com.xno.xno_backend.data;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.Role;
import com.xno.xno_backend.repositories.AppRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(PrePopulate.class)
public class AppRoleRepositoryTest {
    
    @Autowired
    AppRoleRepository appRoleRepository;
    
    @Autowired
    PrePopulate prePopulate;
    
    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }
    
    @Test
    void shouldFindRoleByName() {
        Optional<AppRole> appRole = appRoleRepository.findByRoleName(Role.ROLE_USER);
        assertTrue(appRole.isPresent());
    }
}
