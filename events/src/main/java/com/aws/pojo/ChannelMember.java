package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "channel_member",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"channel_uuid", "users_uuid"})})
public class ChannelMember {

    @Id
    @GeneratedValue
    private UUID uuid;

    @ManyToOne
    @JoinColumn(name = "channel_uuid", nullable = false)
    private Channel channel;

    @ManyToOne
    @JoinColumn(name = "users_uuid", nullable = false)
    private Account user;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Role role = Role.MEMBER;

    @Column(columnDefinition = "TEXT")
    private String permissions;

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_status", length = 15)
    private InvitationStatus invitationStatus = InvitationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "invited_by")
    private Account invitedBy;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    public enum Role {
        OWNER, ADMIN, MODERATOR, EDITOR, MEMBER
    }

    public enum InvitationStatus {
        PENDING, ACCEPTED, DECLINED, REMOVED
    }
}