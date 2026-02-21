package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.Playbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaybookRepository extends JpaRepository<Playbook, Long> {

    Optional<Playbook> findByPlaybookName(String name);

    List<Playbook> findByUser_AppUserId(Long userId);

    Optional<Playbook> findByPlaybookIdAndUser_AppUserId(Long playbookId, Long userId);

    boolean existsByUser_AppUserIdAndPlaybookNameAndPlaybookIdNot(Long userId, String playbookName, Long playbookId);

    boolean existsByUser_AppUserIdAndPlaybookName(Long userId, String playbookName);

    List<Playbook> findByPlaybookNameContainingIgnoreCaseAndUser_AppUserId(String name, Long userId);

    @Query("""
            SELECT DISTINCT pb
            FROM Playbook pb
            LEFT JOIN FETCH pb.plays p
            LEFT JOIN FETCH p.formation f
            WHERE pb.playbookId = :playbookId
            """)
    Optional<Playbook> loadPlaybookByPlaybookId(@Param("playbookId") Long playbookId);
}
