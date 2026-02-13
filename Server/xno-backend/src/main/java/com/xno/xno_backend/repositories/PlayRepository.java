package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.Play;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayRepository extends JpaRepository<Play, Long> {

    Optional<Play> findByPlayName(String playName);

    List<Play> findByFormation_FormationId(Long formationId);

    List<Play> findByPlaybook_PlaybookId(Long playbookId);
}
