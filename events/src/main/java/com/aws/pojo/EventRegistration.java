package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "event_registration",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"event_uuid", "users_uuid"})})
public class EventRegistration {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @ManyToOne
    @JoinColumn(name = "users_uuid", nullable = false)
    public User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", length = 15)
    public RegistrationStatus registrationStatus = RegistrationStatus.REGISTERED;

    @Column(name = "registration_notes", columnDefinition = "TEXT")
    public String registrationNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "check_in_status", length = 15)
    public CheckInStatus checkInStatus = CheckInStatus.NOT_CHECKED_IN;

    @Column(name = "check_in_time")
    public LocalDateTime checkInTime;

    @Column(name = "cancellation_reason", length = 500)
    public String cancellationReason;

    @Column(name = "is_waitlist")
    public Boolean isWaitlist = false;

    @Column(name = "waitlist_position")
    public Integer waitlistPosition;

    public enum RegistrationStatus {
        REGISTERED, CANCELLED, NO_SHOW, ATTENDED
    }

    public enum CheckInStatus {
        NOT_CHECKED_IN, CHECKED_IN, CHECKED_OUT
    }
}