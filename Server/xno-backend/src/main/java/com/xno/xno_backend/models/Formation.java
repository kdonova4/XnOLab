package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "formation")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "formation_id")
    private Long formationId;

    @Column(name = "formation_name", length = 50, nullable = false)
    private String formationName;

    @Column(name = "formation_image_url", length = 300, nullable = false)
    private String formationImageUrl;

    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser user;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Play> plays = new ArrayList<>();

}
