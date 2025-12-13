package me.heahaidu.aws.fcj.notificationservice.kafka;

import java.util.UUID;

public record NotificationEvent(
        String eventId,
        String eventType,
        UUID userUuid,
        String title,
        String body,
        String deepLink,
        String imageUrl
) {}