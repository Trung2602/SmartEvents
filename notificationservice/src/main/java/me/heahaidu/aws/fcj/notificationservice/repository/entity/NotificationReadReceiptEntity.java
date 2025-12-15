package me.heahaidu.aws.fcj.notificationservice.repository.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notification_read_receipt")
public class NotificationReadReceiptEntity {

    @EmbeddedId
    private NotificationReadReceiptId id;

    @Column(name = "read_at", nullable = false, columnDefinition = "timestamp")
    private Instant readAt;

    @PrePersist
    void prePersist() {
        if (readAt == null) readAt = Instant.now();
    }

    public NotificationReadReceiptEntity() {}

    public NotificationReadReceiptEntity(NotificationReadReceiptId id) {
        this.id = id;
    }

    public NotificationReadReceiptId getId() { return id; }
    public void setId(NotificationReadReceiptId id) { this.id = id; }

    public Instant getReadAt() { return readAt; }
    public void setReadAt(Instant readAt) { this.readAt = readAt; }
}