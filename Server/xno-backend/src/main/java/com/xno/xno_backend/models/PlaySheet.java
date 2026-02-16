package com.xno.xno_backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "playsheet")
public class PlaySheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playsheet_id")
    private Long playSheetId;

    @Column(name = "playsheet_name", length = 50, nullable = false)
    private String playSheetName;

    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @Column(name="updated_at")
    private Timestamp updatedAt;

    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "playbook_id", nullable = false)
    private Playbook playbook;

    @OneToMany(mappedBy = "playSheet", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PlaySheetSituation> situations;

    public PlaySheet(String playSheetName, Timestamp createdAt, Timestamp updatedAt, AppUser user, Playbook playbook) {
        this.playSheetName = playSheetName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.playbook = playbook;
    }
}
