package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "app_role")
public class AppRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "app_role_id")
    private Long roleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", unique = true, nullable = false)
    private Role roleName;

    public AppRole(Role roleName) {
        this.roleName = roleName;
    }

    public AppRole(long roleId, Role roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }
}
