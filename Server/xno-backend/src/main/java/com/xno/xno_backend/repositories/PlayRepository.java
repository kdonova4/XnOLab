package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.Play;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayRepository extends JpaRepository<Play, Long> {

    Optional<Play> findByPlayName(String playName);

    List<Play> findByPlayNameContainingIgnoreCaseAndUser_AppUserId(String name, Long userId);

    Optional<Play> findByPlayNameAndUser_AppUserIdAndPlaybook_PlaybookId(String playName, Long userId, Long playbookId);

    List<Play> findByFormation_FormationId(Long formationId);

    List<Play> findByPlaybook_PlaybookIdAndPlaybook_User_AppUserId(Long playbookId, Long userId);

    List<Play> findByFormation_FormationIdAndFormation_User_AppUserId(Long formationId, Long userId);

    void deleteByPlayIdAndUser_AppUserId(Long playId, Long userId);
}
