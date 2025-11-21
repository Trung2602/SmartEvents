package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "channel_uuid")
    public Channel channel;

    @Column(name = "current_version_uuid", nullable = false)
    public UUID currentVersionUuid;

    @Column(name = "original_uuid", nullable = false)
    public UUID originalUuid;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    public Status status = Status.PENDING;

    @Column(name = "max_participants")
    public Integer maxParticipants;

    @Column(name = "current_participants")
    public Integer currentParticipants = 0;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    public Account createdBy;

    @ManyToOne
    @JoinColumn(name = "accepted_by")
    public Admin acceptedBy;

    @Column(name = "edit_count")
    public Integer editCount = 0;

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }
}