package com.aws.services.impl;

import com.aws.pojo.Event;
import com.aws.pojo.EventFeedback;
import com.aws.pojo.User;
import com.aws.repositories.EventFeedbackRepository;
import com.aws.services.EventFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventFeedbackServiceImpl implements EventFeedbackService {

    @Autowired
    private EventFeedbackRepository eventFeedbackRepository;

    @Override
    public Page<EventFeedback> searchEventFeedbackByEvent(Event event, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventFeedbackRepository.findByEvent(event, pageable);
    }

    @Override
    public Page<EventFeedback> searchEventFeedbackByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventFeedbackRepository.findByUser(user, pageable);
    }

    @Override
    public EventFeedback findEventFeedbackByEventAndUser(Event event, User user) {
        Optional<EventFeedback> eventFeedback = this.eventFeedbackRepository.findByEventAndUser(event, user);
        return eventFeedback.orElse(null);
    }

    @Override
    public EventFeedback addOrUpdateEventFeedback(EventFeedback eventFeedback) {
        return this.eventFeedbackRepository.save(eventFeedback);
    }

    @Override
    public void deleteEventFeedback(EventFeedback eventFeedback) {
        this.eventFeedbackRepository.delete(eventFeedback);
    }

    @Override
    public EventFeedback findById(UUID uuid) {
        Optional<EventFeedback> eventFeedback = this.eventFeedbackRepository.findById(uuid);
        return eventFeedback.orElse(null);    }
}
