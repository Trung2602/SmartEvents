package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "chat_history")
public class ChatHistory {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "users_uuid", nullable = false)
    public User user;

    @Column(name = "session_id", nullable = false)
    public UUID sessionId = UUID.randomUUID();

    @Column(nullable = false, columnDefinition = "TEXT")
    public String message;

    @Column(name = "ai_response", nullable = false, columnDefinition = "TEXT")
    public String aiResponse;

    @Column(name = "context_used", columnDefinition = "TEXT")
    public String contextUsed;

    @Column(name = "model_used", length = 100)
    public String modelUsed;

    @Column(name = "response_time_ms")
    public Integer responseTimeMs;
}
