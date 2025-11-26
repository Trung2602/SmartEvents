package com.aws.services;

import com.aws.pojo.Channel;
import com.aws.pojo.Event;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface EventService {
    Event addOrUpdateEvent(Event event);
    void deleteEvent(Event event);
    Event findEventById(UUID uuid);

    Page<Event> searchEventByChannel(Channel channel, int page, int size);

}
