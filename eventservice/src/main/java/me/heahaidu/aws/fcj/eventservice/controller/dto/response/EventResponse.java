package me.heahaidu.aws.fcj.eventservice.controller.dto;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class EventResponse {
    private UUID uuid;
    private UUID pageUuid;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private String city;
    private String category;
    private Integer maxParticipants;
    private Integer currentParticipants;
}