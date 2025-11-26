package com.aws.services.impl;

import com.aws.pojo.Event;
import com.aws.pojo.EventContent;
import com.aws.repositories.EventContentRepository;
import com.aws.services.EventContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EventContentServiceImpl implements EventContentService {

    @Autowired
    private EventContentRepository eventContentRepository;

    @Override
    public Page<EventContent> searchEventContentByEvent(Event event, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.eventContentRepository.findByEvent(event, pageable);
    }

    @Override
    public EventContent addOrUpdateEventContent(EventContent eventContent) {
        return this.eventContentRepository.save(eventContent);
    }

    @Override
    public void deleteEventContent(EventContent eventContent) {
        this.eventContentRepository.delete(eventContent);
    }

    @Override
    public EventContent findById(UUID uuid) {
        Optional<EventContent> eventContent = this.eventContentRepository.findById(uuid);
        return eventContent.orElse(null);
    }
}
