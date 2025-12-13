package me.heahaidu.aws.fcj.eventservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.heahaidu.aws.fcj.eventservice.common.ErrorCode;
import me.heahaidu.aws.fcj.eventservice.controller.dto.request.CreateEventRequest;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventListResponse;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventResponse;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.RegistrationResponse;
import me.heahaidu.aws.fcj.eventservice.enums.EventStatus;
import me.heahaidu.aws.fcj.eventservice.enums.EventVisibility;
import me.heahaidu.aws.fcj.eventservice.enums.RegistrationStatus;
import me.heahaidu.aws.fcj.eventservice.exception.EventException;
import me.heahaidu.aws.fcj.eventservice.exception.EventNotFoundException;
import me.heahaidu.aws.fcj.eventservice.exception.EventRegistrationException;
import me.heahaidu.aws.fcj.eventservice.repository.dto.EventContentProjection;
import me.heahaidu.aws.fcj.eventservice.repository.dto.EventProjection;
import me.heahaidu.aws.fcj.eventservice.repository.entity.Event;
import me.heahaidu.aws.fcj.eventservice.repository.entity.EventContent;
import me.heahaidu.aws.fcj.eventservice.repository.entity.EventRegistration;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventContentRepository;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventListRepository;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventRegistrationRepository;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventRepository;
import me.heahaidu.aws.fcj.eventservice.service.EmailService;
import me.heahaidu.aws.fcj.eventservice.service.EventService;
import me.heahaidu.aws.fcj.eventservice.service.QrService;
import me.heahaidu.aws.fcj.eventservice.util.CursorUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {

    private final EventListRepository eventListRepository;
    private final EventRepository  eventRepository;
    private final EventContentRepository eventContentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final QrService  qrService;
    private final EmailService emailService;

    @Override
    public EventListResponse getEvents(Instant from, Instant to, String search, Integer limit, String cursor) {
        if (limit == null || limit <= 0 || limit > 100) {
            limit = 20;
        }
        if (from == null || to == null) {
            from = Instant.now().minus(Duration.ofDays(3));
            to = Instant.now().plus(Duration.ofDays(3));
        }

        Instant cursorStart = null;
        UUID cursorUuid = null;

        if (cursor != null && !cursor.isBlank()) {
            var decoded = CursorUtil.decode(cursor);
            cursorStart = decoded.startTime();
            cursorUuid = decoded.uuid();
        }

        System.out.println("====== REQUEST PARAMS ======");
        System.out.println("from (before): " + from);
        System.out.println("to (before): " + to);
        System.out.println("search: " + search);
        System.out.println("limit: " + limit);
        System.out.println("cursor: " + cursor);
        System.out.println("============================");

        List<EventProjection> rows = eventListRepository.findEventsKeyset(
                from, to, search, cursorStart, cursorUuid, limit
        ).orElseThrow(() -> new EventException(ErrorCode.EVENT_NOT_FOUND));

        List<EventResponse> items = rows.stream().map(r -> EventResponse.builder()
                .uuid(r.getEventUuid())
                .pageUuid(r.getPageUuid())
                .title(r.getTitle())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .location(r.getLocation())
                .city(r.getCity())
                .category(r.getCategory())
                .maxParticipants(r.getMaxParticipants())
                .currentParticipants(r.getCurrentParticipants())
                .imageUrl(r.getImageUrls()[0])
                .countryCode(r.getCountryCode())
                .build()
        ).toList();

        boolean hasNext = items.size() == limit;
        String nextCursor = null;

        if (hasNext) {
            var last = rows.getLast();
            nextCursor = CursorUtil.encode(last.getStartTime(), last.getEventUuid());
        }

        return EventListResponse.builder()
                .items(items)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .build();
    }

    @Override
    public EventResponse getEvent(UUID event_id) {
        EventContentProjection item = eventContentRepository.findByEventByUuid(event_id);
        return EventResponse.builder()
                .uuid(item.getEventUuid())
                .pageUuid(item.getPageUuid())
                .title(item.getTitle())
                .description(item.getDescription())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .location(item.getLocation())
                .city(item.getCity())
                .imageUrl(item.getImageUrls()[0])
                .category(item.getCategory())
                .maxParticipants(item.getMaxParticipants())
                .currentParticipants(item.getCurrentParticipants())
                .price(item.getPrice())
                .currency(item.getCurrency())
                .countryCode(item.getCountryCode())
                .build();
    }

    @Override
    public EventResponse createEvent(CreateEventRequest request, UUID createdBy) {
        log.info("Creating event by user: {}", createdBy);

        verifyCreatePermission(request.getPageUuid(), createdBy);
        validateTimeRange(request.getStartTime(), request.getEndTime());

        Event event = Event.builder()
                .pageUuid(request.getPageUuid())
                .status(EventStatus.DRAFT)
                .visibility(EventVisibility.valueOf(request.getVisibility()))
                .maxParticipants(request.getMaxParticipants())
                .createdBy(createdBy)
                .createdAt(Instant.now())
                .build();

        event.setCurrentVersionUuid(UUID.randomUUID());
        event = eventRepository.save(event);

        EventContent content = EventContent.builder()
                .eventUuid(event.getUuid())
                .versionNumber(1)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .city(request.getCity())
                .category(request.getCategory())
                .subcategory(request.getSubcategory())
                .tags(request.getTags())
                .countryCode(request.getCountryCode())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .timezone(request.getTimezone() != null ? request.getTimezone() : "UTC")
                .imageUrls(request.getImageUrls())
                .videoUrl(request.getVideoUrl())
                .hostUuids(request.getHostUuids())
                .editedBy(createdBy)
                .isCurrentVersion(true)
                .build();

        content = eventContentRepository.save(content);

        event.setCurrentVersionUuid(content.getUuid());
        event = eventRepository.save(event);

        log.info("Event created successfully: uuid={}", event.getUuid());
        return EventResponse.from(event, content);
    }

    @Override
    public EventResponse deleteEvent(UUID event_id) {
        return null;
    }

    @Override
    public EventResponse editEvent(UUID eventUuid, CreateEventRequest request, UUID createdBy) {
        log.info("Editing event: eventUuid={}, userUuid={}", eventUuid, createdBy);

        Event event = eventRepository.findByUuidAndNotDeleted(eventUuid)
                .orElseThrow(() -> new EventNotFoundException(eventUuid));

        validateTimeRange(request.getStartTime(), request.getEndTime());
        verifyEditPermission(event.getPageUuid(), createdBy);


        EventContent currentContent = eventContentRepository.findByUuid(event.getCurrentVersionUuid())
                .orElseThrow(() -> new EventException(ErrorCode.EVENT_CONTENT_NOT_FOUND));

        Integer nextVersion = eventContentRepository.findMaxVersionByEventUuid(eventUuid) + 1;

        eventContentRepository.markAllVersionsAsNotCurrent(eventUuid);

        EventContent newContent = EventContent.builder()
                .eventUuid(eventUuid)
                .previousVersionUuid(currentContent.getUuid())
                .versionNumber(nextVersion)
                .title(getOrDefault(request.getTitle(), currentContent.getTitle()))
                .description(getOrDefault(request.getDescription(), currentContent.getDescription()))
                .location(getOrDefault(request.getLocation(), currentContent.getLocation()))
                .city(getOrDefault(request.getCity(), currentContent.getCity()))
                .category(getOrDefault(request.getCategory(), currentContent.getCategory()))
                .subcategory(getOrDefault(request.getSubcategory(), currentContent.getSubcategory()))
                .tags(request.getTags() != null ? request.getTags() : currentContent.getTags())
                .countryCode(getOrDefault(request.getCountryCode(), currentContent.getCountryCode()))
                .startTime(request.getStartTime() != null ? request.getStartTime() : currentContent.getStartTime())
                .endTime(request.getEndTime() != null ? request.getEndTime() : currentContent.getEndTime())
                .timezone(getOrDefault(request.getTimezone(), currentContent.getTimezone()))
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : currentContent.getImageUrls())
                .videoUrl(getOrDefault(request.getVideoUrl(), currentContent.getVideoUrl()))
                .hostUuids(request.getHostUuids() != null ? request.getHostUuids() : currentContent.getHostUuids())
                .editedBy(createdBy)
                .isCurrentVersion(true)
                .build();

        newContent = eventContentRepository.save(newContent);

        event.setCurrentVersionUuid(newContent.getUuid());
        if (request.getMaxParticipants() != null) {
            event.setMaxParticipants(request.getMaxParticipants());
        }
        if (request.getVisibility() != null) {
            event.setVisibility(EventVisibility.valueOf(request.getVisibility()));
        }
        event = eventRepository.save(event);

        log.info("Event edited successfully: uuid={}, version={}", eventUuid, nextVersion);
        return EventResponse.from(event, newContent);
    }

    @Override
    @Transactional
    public RegistrationResponse registerEvent(UUID eventUuid, UUID userUuid, String email) {

        log.info("Registering for event: eventUuid={}, userUuid={}, email={}", eventUuid.toString(), userUuid.toString(), email);

        Event event = eventRepository.findByUuidAndStatusAndNotDeleted(eventUuid, EventStatus.PUBLISHED)
                .orElseThrow(EventRegistrationException::eventNotPublished);

        EventContent content = eventContentRepository.findByUuid(event.getCurrentVersionUuid())
                .orElseThrow(() -> new EventException(ErrorCode.EVENT_CONTENT_NOT_FOUND));

        if (content.getEndTime().isBefore(Instant.now())) {
            throw EventRegistrationException.eventEnded();
        }

        if (event.getCurrentParticipants() != null && event.getCurrentParticipants() >= event.getMaxParticipants()) {
            throw EventRegistrationException.eventFull();
        }

        eventRegistrationRepository.findByEventAndUserAndStatus(eventUuid, userUuid, RegistrationStatus.REGISTERED.name())
                .ifPresent(r -> {
                    throw EventRegistrationException.alreadyRegistered();
                });

        EventRegistration registration = EventRegistration.builder()
                .eventUuid(eventUuid)
                .userUuid(userUuid)
                .createdAt(Instant.now())
                .registrationStatus(RegistrationStatus.REGISTERED)
                .currency(content.getCurrency())
                .ticketPrice(content.getPrice())
                .updatedAt(Instant.now())
                .build();

        registration = eventRegistrationRepository.save(registration);

        int cur = event.getCurrentParticipants() == null ? 0 : event.getCurrentParticipants();
        event.setCurrentParticipants(cur + 1);

        eventRepository.save(event);

        sendConfirmationEmail(registration, userUuid, email);

        log.info("Registration successful: registrationUuid={}", registration.getUuid());
        return RegistrationResponse.from(registration, email, "Successfully registered for event");
    }

    @Override
    public RegistrationResponse unregisterEvent(UUID eventUuid, UUID userUuid, String email) {

        log.info("Unregistering from event: eventUuid={}, userUuid={}", eventUuid, userUuid);

        EventRegistration registration = eventRegistrationRepository
                .findByEventAndUserAndStatus(eventUuid, userUuid, RegistrationStatus.REGISTERED.name())
                .orElseThrow(EventRegistrationException::notRegistered);

        registration.setRegistrationStatus(RegistrationStatus.CANCELLED);
        eventRegistrationRepository.save(registration);

        Event event = eventRepository
                .findByUuidAndNotDeleted(eventUuid)
                .orElseThrow(EventRegistrationException::eventNotPublished);

        log.info("Unregistration successful: eventUuid={}, userUuid={}", eventUuid, userUuid);
        return RegistrationResponse.unregistered(eventUuid, userUuid, email);
    }

    private void validateTimeRange(Instant startTime, Instant endTime) {
        if (endTime.isBefore(startTime)) {
            throw new EventException("INVALID_TIME", "End time must be after start times");
        }

        if (startTime.isBefore(Instant.now())) {
            throw new EventException("INVALID_TIME", "Start time must be after now");
        }
        if (endTime.isBefore(Instant.now())) {
            throw new EventException("INVALID_TIME", "End time must be after now");
        }
    }

    private void verifyCreatePermission(UUID pageUuid, UUID userUuid) {

    }

    private void verifyEditPermission(UUID pageUuid, UUID userUuid) {

    }

    private String getOrDefault(String newValue, String defaultValue) {
        return (newValue != null && !newValue.isBlank()) ? newValue : defaultValue;
    }

    private void sendConfirmationEmail(
            EventRegistration registration,
            UUID userUuid,
            String email
    ) {
        try {
            byte[] qrImage = qrService.generateQrCodeImage(registration.getUuid());

            me.heahaidu.aws.fcj.eventservice.repository.dto.EventContentProjection event = eventContentRepository.findByEventByUuid(registration.getEventUuid());

            emailService.sendRegistrationConfirmation(
                    EmailService.RegistrationEmailRequest.builder()
                            .userEmail(email)
                            .userUuid(userUuid)
                            .event(event)
                            .qrImage(qrImage)
                            .build()
            );

        } catch (Exception e) {
            log.error("Failed to send confirmation email for registration: {}", registration.getUuid(), e);
        }
    }

}
