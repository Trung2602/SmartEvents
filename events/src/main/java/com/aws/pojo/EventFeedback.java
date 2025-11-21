package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "event_feedback",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"event_uuid", "users_uuid"})})
public class EventFeedback {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @ManyToOne
    @JoinColumn(name = "users_uuid", nullable = false)
    public User user;

    @Column(nullable = false)
    public Short rating;

    @Column(columnDefinition = "TEXT")
    public String comment;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    public Sentiment sentiment;

    @Column(name = "sentiment_confidence")
    public BigDecimal sentimentConfidence;

    public enum Sentiment {
        POSITIVE, NEUTRAL, NEGATIVE
    }
}