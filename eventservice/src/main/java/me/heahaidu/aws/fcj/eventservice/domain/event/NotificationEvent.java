package me.heahaidu.aws.fcj.eventservice.domain.event;

import java.time.Instant;
import java.util.UUID;

public record NotificationEvent(
        UUID eventId,
        UUID userUuid,
        String eventType,
        String title,
        String body,
        String deepLink,
        String imageUrl,
        Instant occurredAt,
        int schemaVersion
) {}