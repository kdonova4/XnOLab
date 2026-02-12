package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "app_user_id")
    private Long appUserId;

    @Column(name = "username", nullable = false, length = 30, unique = true)
    private String username;

    @Column(name = "email", nullable = false, length = 254, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 2048)
    private String password;

    @Column(name = "disabled", nullable = false)
    private boolean disabled = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "app_user_role" ,
    joinColumns = @JoinColumn(name = "app_user_id"),
    inverseJoinColumns = @JoinColumn(name = "app_role_id"))
    private Set<Role> roles = new HashSet<>();
}
