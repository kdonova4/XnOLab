package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {

    Optional<Formation> findByFormationName(String formationName);

    List<Formation> findByUser_AppUserId(Long userId);
}
