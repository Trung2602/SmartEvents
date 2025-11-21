package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "recommendation",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"users_uuid", "event_uuid"})})
public class Recommendation {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "users_uuid", nullable = false)
    public User user;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @Column(name = "model_used", nullable = false, length = 100)
    public String modelUsed;

    @Column(name = "confidence_score", nullable = false)
    public BigDecimal confidenceScore;

    @Column(columnDefinition = "TEXT")
    public String reasoning;

    @Column(name = "is_clicked")
    public Boolean isClicked = false;

    @Column(name = "is_registered")
    public Boolean isRegistered = false;

    @Column(name = "expires_at")
    public LocalDateTime expiresAt;
}
