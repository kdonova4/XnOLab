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

    Optional<PlaySheet> findByPlaySheetIdAndUser_AppUserId(Long playSheetId, Long userId);

    List<PlaySheet> findByPlaySheetNameContainingIgnoreCaseAndUser_AppUserId(String name, Long userId);

    List<PlaySheet> findByUser_AppUserId(Long userId);

    List<PlaySheet> findByPlaybook_PlaybookIdAndUser_AppUserId(Long playbookId, Long userId);

    @Query("""
            SELECT DISTINCT ps
            FROM PlaySheet ps
            LEFT JOIN FETCH ps.situations pss
            LEFT JOIN FETCH pss.plays pssp
            LEFT JOIN FETCH pssp.play
            WHERE ps.playSheetId = :id
            AND ps.user.appUserId = :userId
            """)
    Optional<PlaySheet> loadPlaySheetByPlaySheetIdAndUserId(@Param("id") Long playSheetId, @Param("userId") Long userId);

    void deleteByPlaySheetIdAndUser_AppUserId(Long playSheetId, Long userId);

}
