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
    List<Playbook> findByUser_AppUserId(Long userId);

    Optional<Playbook> findByPlaybookName(String playbookName);

    @Query("""
            SELECT DISTINCT pb
            FROM Playbook pb
            LEFT JOIN FETCH pb.plays p
            WHERE pb.user.appUserId = :userId
            """)
    List<Playbook> loadPlaybookByUser(@Param("userId") Long userId);
}
