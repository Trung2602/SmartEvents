package com.aws.services.impl;

import com.aws.pojo.Event;
import com.aws.pojo.EventRegistration;
import com.aws.pojo.User;
import com.aws.repositories.EventRegistrationRepository;
import com.aws.services.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Override
    public Page<EventRegistration> searchEventRegistrationsByEvent(Event event, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventRegistrationRepository.findByEvent(event, pageable);
    }

    @Override
    public Page<EventRegistration> searchEventRegistrationByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventRegistrationRepository.findByUser(user, pageable);
    }

    @Override
    public EventRegistration searchEventRegistrationByUserAndEvent(Event event, User user) {
        Optional<EventRegistration> eventRegistration = this.eventRegistrationRepository.findByEventAndUser(event, user);
        return eventRegistration.orElse(null);
    }

    @Override
    public EventRegistration addOrUpdateEventRegistration(EventRegistration eventRegistration) {
        return this.eventRegistrationRepository.save(eventRegistration);
    }

    @Override
    public void deleteEventRegistration(EventRegistration eventRegistration) {
        this.eventRegistrationRepository.delete(eventRegistration);
    }

    @Override
    public EventRegistration findById(UUID uuid) {
        Optional<EventRegistration> eventRegistration = this.eventRegistrationRepository.findById(uuid);
        return eventRegistration.orElse(null);
    }
}
