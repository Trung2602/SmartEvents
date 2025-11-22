package com.aws.services.impl;

import com.aws.repositories.EventRepository;
import com.aws.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
}
