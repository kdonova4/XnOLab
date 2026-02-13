package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.PlaySheetSituation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaySheetSituationRepository extends JpaRepository<PlaySheetSituation, Long> {

    Optional<PlaySheetSituation> findBySituationName(String situationName);

    List<PlaySheetSituation> findByPlaySheet_PlaySheetId(Long playSheetId);
}
