package me.heahaidu.aws.fcj.eventservice.service;

import me.heahaidu.aws.fcj.eventservice.controller.dto.request.CreateEventRequest;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventListResponse;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventResponse;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.RegistrationResponse;

import java.time.Instant;
import java.util.UUID;

public interface EventService {
    EventListResponse getEvents(Instant from, Instant to, String search, Integer limit, String cursor);
    EventResponse getEvent(UUID event_id);
    EventResponse createEvent(CreateEventRequest request, UUID createdBy);
    EventResponse deleteEvent(UUID event_id);
    EventResponse editEvent(UUID event_id, CreateEventRequest request, UUID createdBy);
    RegistrationResponse registerEvent(UUID event_id, UUID createdBy, String userEmail);
    RegistrationResponse unregisterEvent(UUID event_id, UUID createdBy, String userEmail);
}
