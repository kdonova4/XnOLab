package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "playsheet_situation_play")
public class PlaySheetSituationPlay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playsheet_situation_play_id")
    private Long playSheetSituationPlayId;

    @ManyToOne
    @JoinColumn(name = "playsheet_situation_id", nullable = false)
    private PlaySheetSituation playSheetSituation;

    @ManyToOne
    @JoinColumn(name = "play_id", nullable = false)
    private Play play;

    public PlaySheetSituationPlay(PlaySheetSituation playSheetSituation, Play play) {
        this.playSheetSituation = playSheetSituation;
        this.play = play;
    }
}
