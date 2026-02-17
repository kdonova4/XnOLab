package com.xno.xno_backend.data;

import com.xno.xno_backend.models.PlaySheet;
import com.xno.xno_backend.models.PlaySheetSituation;
import com.xno.xno_backend.models.Playbook;
import com.xno.xno_backend.repositories.PlaySheetRepository;
import com.xno.xno_backend.repositories.PlaySheetSituationRepository;
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
public class PlaySheetSituationRepositoryTest {

    @Autowired
    PlaySheetSituationRepository playSheetSituationRepository;

    @Autowired
    PlaySheetRepository playSheetRepository;

    @Autowired
    PrePopulate prePopulate;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }

    @Test
    void shouldFindSituationByName() {
        Optional<PlaySheetSituation> playSheetSituation = playSheetSituationRepository.findBySituationName("situation1");
        assertTrue(playSheetSituation.isPresent());
    }

    @Test
    void shouldFindByPlaySheetId() {
        Optional<PlaySheet> playSheet = playSheetRepository.findByPlaySheetName("playsheet1");
        List<PlaySheetSituation> situations = playSheetSituationRepository.findByPlaySheet_PlaySheetId(playSheet.get().getPlaySheetId());
        assertEquals(2, situations.size());
    }
}
