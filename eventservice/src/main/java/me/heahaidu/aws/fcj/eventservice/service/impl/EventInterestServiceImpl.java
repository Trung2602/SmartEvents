package me.heahaidu.aws.fcj.eventservice.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.heahaidu.aws.fcj.eventservice.common.ErrorCode;
import me.heahaidu.aws.fcj.eventservice.exception.EventInterestException;
import me.heahaidu.aws.fcj.eventservice.exception.EventNotFoundException;
import me.heahaidu.aws.fcj.eventservice.repository.dto.EventProjection;
import me.heahaidu.aws.fcj.eventservice.repository.entity.EventInterest;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventContentRepository;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventInterestRepository;
import me.heahaidu.aws.fcj.eventservice.repository.jpa.EventRepository;
import me.heahaidu.aws.fcj.eventservice.service.EventInterestService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EventInterestServiceImpl implements EventInterestService {

    private final EventRepository eventRepository;
    private final EventContentRepository eventContentRepository;
    private final EventInterestRepository eventInterestRepository;

    @Override
    public List<EventProjection> getUserInterestEvents(UUID userUuid) {

        return List.of();
    }

    @Override
    public void interest(UUID eventUuid, UUID userUuid) {
        if (!eventRepository.existsById(eventUuid)) {
            throw new EventNotFoundException(eventUuid);
        }

        if (eventInterestRepository.existsByEventUuidAndUserUuid(eventUuid, userUuid)) {
            throw new EventInterestException(ErrorCode.ALREADY_INTEREST);
        }

        EventInterest eventInterest = EventInterest.builder().eventUuid(eventUuid).userUuid(userUuid).build();
        eventInterestRepository.save(eventInterest);
    }

    @Override
    public void uninterest(UUID eventUuid, UUID userUuid) {
        if (!eventRepository.existsById(eventUuid)) {
            throw new EventNotFoundException(eventUuid);
        }


    }
}
