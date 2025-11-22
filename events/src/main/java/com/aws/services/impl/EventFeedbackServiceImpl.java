package com.aws.services.impl;

import com.aws.repositories.EventFeedbackRepository;
import com.aws.services.EventFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventFeedbackServiceImpl implements EventFeedbackService {

    @Autowired
    private EventFeedbackRepository eventFeedbackRepository;
}
