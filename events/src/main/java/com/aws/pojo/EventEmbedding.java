package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "event_embedding",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"event_uuid"})})
public class EventEmbedding {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @Column(name = "embedding_vector", columnDefinition = "TEXT")
    public String embeddingVector;

    @Column(name = "source_text", nullable = false, columnDefinition = "TEXT")
    public String sourceText;

    @Column(name = "model_used", nullable = false, length = 100)
    public String modelUsed;

    @Column(nullable = false)
    public Integer dimension;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt = LocalDateTime.now();
}