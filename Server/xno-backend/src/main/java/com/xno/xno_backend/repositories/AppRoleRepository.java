package com.xno.xno_backend.repositories;

import com.xno.xno_backend.models.AppRole;
import com.xno.xno_backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
    Optional<AppRole> findByRoleName(Role role);
}
