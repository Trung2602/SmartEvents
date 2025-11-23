package com.aws.services.impl;

import com.aws.repositories.EventContentRepository;
import com.aws.services.EventContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventContentServiceImpl implements EventContentService {

    @Autowired
    private EventContentRepository eventContentRepository;
}
