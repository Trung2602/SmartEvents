package me.heahaidu.aws.fcj.eventservice.repository.dto;

import java.time.Instant;
import java.util.UUID;

public interface EventProjection {

    UUID getEvent_uuid();
    UUID getPage_uuid();
    Integer getCurrent_participants();
    Integer getMax_participants();
    String getTitle();
    Instant getStart_time();
    Instant getEnd_time();
    String getLocation();
    String getCity();
    String getCategory();
}
