package me.heahaidu.aws.fcj.eventservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.heahaidu.aws.fcj.eventservice.controller.dto.request.CreateEventRequest;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventListResponse;
import me.heahaidu.aws.fcj.eventservice.controller.dto.response.EventResponse;
import me.heahaidu.aws.fcj.eventservice.service.EventInterestService;
import me.heahaidu.aws.fcj.eventservice.service.EventRegisterService;
import me.heahaidu.aws.fcj.eventservice.service.EventService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventService eventService;
    private final EventInterestService eventInterestService;
    private final EventRegisterService eventRegisterService;

    @GetMapping("/events")
    public ResponseEntity<EventListResponse> getEvents(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "20") Integer limit,
            @RequestParam(required = false) String cursor
            )
    {

        EventListResponse eventListResponse = eventService.getEvents(from, to, search, limit, cursor);

        return ResponseEntity.ok(eventListResponse);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable UUID eventId) {
        EventResponse eventResponse = eventService.getEvent(eventId);
        return ResponseEntity.ok(eventResponse);
    }

    @PostMapping("/event/create")
    public ResponseEntity<?> createEvent(
            @RequestHeader("X-User-UUID") UUID createBy,
            @Valid @RequestBody CreateEventRequest request
            ) {
            log.info(createBy.toString());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Event created successfully");
    }

    @GetMapping("/event/register/{eventId}")
    public ResponseEntity<?> registerEvent(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-UUID") UUID userUuid,
            @RequestHeader("X-User-Email") String email) {
        eventRegisterService.registerEvent(eventId, userUuid, email);
        return ResponseEntity.status(200).build();
    }

    @GetMapping("/event/unregister/{eventId}")
    public ResponseEntity<?> unregisterEvent(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-UUID") UUID userUuid,
            @RequestHeader("X-User-Email") String email) {
        eventRegisterService.unregisterEvent(eventId, userUuid, email);
        return ResponseEntity.status(200).build();
    }

    @GetMapping("/event/unregister/{eventId}")
    public ResponseEntity<?> unregisterEvent(@PathVariable UUID eventId) {

        return ResponseEntity.status(200).build();
    }

    @GetMapping("/event/interest/{eventId}")
    public ResponseEntity<?> interestEvent(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-UUID") UUID userUuid) {

        eventInterestService.interest(eventId, userUuid);
        return ResponseEntity.status(200).build();
    }

    @GetMapping("/event/uninterest/{eventId}")
    public ResponseEntity<?> uninterestEvent(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-UUID") UUID userUuid) {
        eventInterestService.uninterest(eventId, userUuid);
        return ResponseEntity.status(200).build();
    }

//    @GetMapping("/registrations/{registrationUuid}/qr-code")
//    public ResponseEntity<byte[]> getQrCode(
//            @PathVariable UUID registrationUuid,
//            @AuthenticationPrincipal UUID userUuid
//    ) {
//        byte[] qrImage = registrationService.getTicketQrCode(registrationUuid, userUuid);
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.IMAGE_PNG)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"ticket-qr.png\"")
//                .body(qrImage);
//    }
}
