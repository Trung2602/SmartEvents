package com.aws.services.impl;

import com.aws.repositories.ChannelFollowerRepository;
import com.aws.services.ChannelFollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChannelFollowerServiceImpl implements ChannelFollowerService {

    @Autowired
    private ChannelFollowerRepository channelFollowerRepository;

}
