package com.xno.xno_backend.domain;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.AppUser;
import com.xno.xno_backend.models.DTOs.CreateDTOs.PlaybookCreateDTO;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.models.Role;
import com.xno.xno_backend.repositories.AppUserRepository;
import com.xno.xno_backend.repositories.PlaybookRepository;
import com.xno.xno_backend.services.PlaybookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class PlaybookServiceTest {
    @Mock
    PlaybookRepository playbookRepository;

    @Mock
    AppUserRepository appUserRepository;

    @InjectMocks
    PlaybookServiceImpl playbookService;

    private AppUser appUser;
    private AppRole appRole;
    private Playbook playbook;
    private PlaybookCreateDTO playbookCreateDTO;

    @BeforeEach
    void setup() {
        appRole = new AppRole(1L, Role.ROLE_USER);
        appUser = new AppUser(1L, "kdonova4", "kdonova4@gmail.com", "password1234", false, Set.of(appRole));
        playbook = new Playbook("playbook1", appUser);
        playbookCreateDTO = new PlaybookCreateDTO(playbook.getPlaybookName());
    }
    
}
