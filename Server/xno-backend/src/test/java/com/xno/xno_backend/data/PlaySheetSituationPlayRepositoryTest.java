package com.xno.xno_backend.data;

import com.xno.xno_backend.models.Play;
import com.xno.xno_backend.models.PlaySheetSituation;
import com.xno.xno_backend.models.PlaySheetSituationPlay;
import com.xno.xno_backend.repositories.PlayRepository;
import com.xno.xno_backend.repositories.PlaySheetSituationPlayRepository;
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
public class PlaySheetSituationPlayRepositoryTest {

    @Autowired
    PlaySheetSituationPlayRepository playSheetSituationPlayRepository;

    @Autowired
    PlaySheetSituationRepository playSheetSituationRepository;

    @Autowired
    PlayRepository playRepository;

    @Autowired
    PrePopulate prePopulate;

    @BeforeEach
    public void setup() {
        prePopulate.populate();
    }

    @Test
    void shouldFindByPlaySheetSituationId() {
        Optional<PlaySheetSituation> playSheetSituation = playSheetSituationRepository.findBySituationName("situation1");
        List<PlaySheetSituationPlay> plays = playSheetSituationPlayRepository.findByPlaySheetSituation_PlaySheetSituationId(playSheetSituation.get().getPlaySheetSituationId());
        assertEquals(2, plays.size());
    }

    @Test
    void shouldFindByPlayId() {
        Optional<Play> play = playRepository.findByPlayName("play1");
        List<PlaySheetSituationPlay> plays = playSheetSituationPlayRepository.findByPlay_PlayId(play.get().getPlayId());
        assertEquals(1, plays.size());
    }

    @Test
    void shouldFindByPlaySheetSituationAndPlayIds() {
        Optional<Play> play = playRepository.findByPlayName("play1");
        Optional<PlaySheetSituation> playSheetSituation = playSheetSituationRepository.findBySituationName("situation1");
        Optional<PlaySheetSituationPlay> playSheetSituationPlay =
                playSheetSituationPlayRepository.findByPlaySheetSituation_PlaySheetSituationIdAndPlay_PlayId(playSheetSituation.get().getPlaySheetSituationId(),
                        play.get().getPlayId());
        assertTrue(playSheetSituationPlay.isPresent());
    }
}
