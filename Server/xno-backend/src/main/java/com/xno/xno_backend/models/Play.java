package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "play")
public class Play {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "play_id")
    private Long playId;

    @Column(name = "play_name", length = 50, nullable = false)
    private String playName;

    @Column(name = "play_image_url", length = 300, nullable = false)
    private String playImageUrl;

    @Column(name = "notes")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "playbook_id", nullable = false)
    private Playbook playbook;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    private Formation formation;
}
