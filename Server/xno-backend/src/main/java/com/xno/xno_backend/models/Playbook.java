package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "playbook",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_user_playbook_name",
                columnNames = {"app_user_id", "playbook_name"}
        ))
public class Playbook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playbook_id")
    private Long playbookId;

    @Column(name = "playbook_name", length = 50, nullable = false)
    private String playbookName;

    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser user;

    @OneToMany(mappedBy = "playbook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Play> plays = new ArrayList<>();

    public Playbook(Long playbookId, String playbookName, AppUser user) {
        this.playbookId = playbookId;
        this.playbookName = playbookName;
        this.user = user;
    }

    public Playbook(String playbookName, AppUser user) {
        this.playbookName = playbookName;
        this.user = user;
    }
}
