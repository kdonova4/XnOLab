package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.PlaySheetSituationPlay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaySheetSituationPlayRepository extends JpaRepository<PlaySheetSituationPlay, Long> {

    List<PlaySheetSituationPlay> findByPlaySheetSituation_PlaySheetSituationId(Long playSheetSituationId);

    List<PlaySheetSituationPlay> findByPlay_PlayId(Long playId);

    Optional<PlaySheetSituationPlay> findByPlaySheetSituation_PlaySheetSituationIdAndPlay_PlayId(Long playSheetSituationId, Long playId);
}
