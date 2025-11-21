package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "channel_follower",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"channel_uuid", "follower_uuid"})})
public class ChannelFollower {

    @Id
    @GeneratedValue
    private UUID uuid;

    @ManyToOne
    @JoinColumn(name = "channel_uuid", nullable = false)
    public Channel channel;

    @ManyToOne
    @JoinColumn(name = "follower_uuid", nullable = false)
    public Account follower;

    @Column(name = "notification_enabled")
    public Boolean notificationEnabled = true;
}