package com.aws.services.impl;

import com.aws.pojo.Channel;
import com.aws.pojo.Event;
import com.aws.repositories.EventRepository;
import com.aws.services.EventService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Transactional
    @Override
    public Event addOrUpdateEvent(Event event) {
        return this.eventRepository.save(event);
    }

    @Transactional
    @Override
    public void deleteEvent(Event event) {
        this.eventRepository.delete(event);
    }

    @Override
    public Event findEventById(UUID uuid) {
        Optional<Event> event = this.eventRepository.findById(uuid);
        return event.orElse(null);
    }

    @Override
    public Page<Event> searchEventByChannel(Channel channel, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventRepository.findByChannel(channel, pageable);
    }
}
