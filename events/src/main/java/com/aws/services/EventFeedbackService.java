package com.aws.services;

import com.aws.pojo.Event;
import com.aws.pojo.EventFeedback;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface EventFeedbackService {
    Page<EventFeedback> searchEventFeedbackByEvent(Event event, int page, int size);
    Page<EventFeedback> searchEventFeedbackByUser(User user, int page, int size);

    EventFeedback findEventFeedbackByEventAndUser(Event event, User user);

    EventFeedback addOrUpdateEventFeedback(EventFeedback eventFeedback);
    void deleteEventFeedback(EventFeedback eventFeedback);
    EventFeedback findById(UUID uuid);
}
