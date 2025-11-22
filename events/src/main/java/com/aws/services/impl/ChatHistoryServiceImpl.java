package com.aws.services.impl;

import com.aws.repositories.ChatHistoryRepository;
import com.aws.services.ChatHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatHistoryServiceImpl implements ChatHistoryService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

}
