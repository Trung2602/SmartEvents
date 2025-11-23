package com.aws.services.impl;

import com.aws.repositories.EventEmbeddingRepository;
import com.aws.services.EventEmbeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventEmbeddingServiceImpl implements EventEmbeddingService {

    @Autowired
    private EventEmbeddingRepository eventEmbeddingRepository;

}
