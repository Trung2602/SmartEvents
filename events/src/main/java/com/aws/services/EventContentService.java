package com.aws.services;

import com.aws.pojo.Event;
import com.aws.pojo.EventContent;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface EventContentService {
    Page<EventContent> searchEventContentByEvent(Event event, int page, int size);
    EventContent addOrUpdateEventContent(EventContent eventContent);
    void deleteEventContent(EventContent eventContent);
    EventContent findById(UUID uuid);
}
