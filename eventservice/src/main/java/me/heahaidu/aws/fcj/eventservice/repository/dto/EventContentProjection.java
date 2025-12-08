package me.heahaidu.aws.fcj.eventservice.repository.dto;

import java.time.Instant;
import java.util.UUID;

public interface EventContentProjection extends EventProjection {
    UUID getEvent_uuid();
    UUID getPage_uuid();
    Integer getCurrent_participants();
    Integer getMax_participants();
    String getTitle();
    String getDescription();
    Instant getStart_time();
    Instant getEnd_time();
    String getLocation();
    String getCity();
    String getCategory();
}
