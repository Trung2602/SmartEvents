package me.heahaidu.aws.fcj.notificationservice.domain.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NotificationEvent(
        String eventId,
        String eventType,
        UUID userUuid,
        String title,
        String body,
        String deepLink,
        String imageUrl
) {}