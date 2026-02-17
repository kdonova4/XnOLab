package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.PlaySheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaySheetRepository extends JpaRepository<PlaySheet, Long> {

    Optional<PlaySheet> findByPlaySheetName(String playSheetName);

    List<PlaySheet> findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId(String name, Long userId);

    List<PlaySheet> findByUser_AppUserId(Long userId);

    List<PlaySheet> findByPlaybook_PlaybookId(Long playbookId);

    @Query("""
            SELECT DISTINCT ps
            FROM PlaySheet ps
            LEFT JOIN FETCH ps.situations pss
            LEFT JOIN FETCH pss.plays pssp
            LEFT JOIN FETCH pssp.play
            WHERE ps.playSheetId = :id
            """)
    Optional<PlaySheet> loadPlaySheetById(@Param("id") Long playSheetId);
}
