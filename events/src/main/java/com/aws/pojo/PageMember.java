package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "page_member")
public class PageMember {

    @Id
    @GeneratedValue
    private UUID uuid;

    @Column(name = "page_uuid", nullable = false)
    private UUID pageUuid;

    @Column(name = "user_uuid", nullable = false)
    private UUID userUuid;

    @Column(length = 50)
    private String role;

    @Column(columnDefinition = "jsonb")
    private String permissions;

    @Column(name = "invitation_status")
    private String invitationStatus;

    @Column(name = "invited_by")
    private UUID invitedBy;

    @Column(name = "invited_at")
    private LocalDateTime invitedAt;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;
}
