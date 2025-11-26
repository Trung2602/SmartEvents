package com.aws.services;

import com.aws.pojo.Event;
import com.aws.pojo.EventRegistration;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface EventRegistrationService {
    Page<EventRegistration> searchEventRegistrationsByEvent(Event event, int page, int size);
    Page<EventRegistration> searchEventRegistrationByUser(User user, int page, int size);
    EventRegistration searchEventRegistrationByUserAndEvent(Event event, User user);

    EventRegistration addOrUpdateEventRegistration(EventRegistration eventRegistration);
    void deleteEventRegistration(EventRegistration eventRegistration);
    EventRegistration findById(UUID uuid);

}
