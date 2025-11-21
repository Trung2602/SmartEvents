package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "channel")
public class Channel {

    @Id
    @GeneratedValue
    private UUID uuid;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel_type", length = 20)
    private ChannelType channelType = ChannelType.PERSONAL;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "follower_count")
    private Integer followerCount = 0;

    @Column(name = "event_count")
    private Integer eventCount = 0;

    @ManyToOne
    @JoinColumn(name = "owner_uuid", nullable = false)
    private Account owner;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private ChannelStatus status = ChannelStatus.ACTIVE;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ChannelType {
        PERSONAL, ORGANIZATION, BUSINESS, COMMUNITY
    }

    public enum ChannelStatus {
        ACTIVE, SUSPENDED, DELETED
    }
}