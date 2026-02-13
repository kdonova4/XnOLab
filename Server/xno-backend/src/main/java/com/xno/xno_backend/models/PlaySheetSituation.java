package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "playsheet_situation")
public class PlaySheetSituation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playsheet_situation_id")
    private Long playSheetSituationId;

    @Column(name = "situation_name", length = 50, nullable = false)
    private String situationName;

    @Column(name = "situation_color", length = 50, nullable = false)
    private String situationColor;

    @ManyToOne
    @JoinColumn(name = "playsheet_id", nullable = false)
    private PlaySheet playSheet;

    @OneToMany(mappedBy = "playSheetSituation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaySheetSituationPlay> plays;
}
