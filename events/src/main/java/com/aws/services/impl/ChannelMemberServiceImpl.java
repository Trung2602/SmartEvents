package com.aws.services.impl;

import com.aws.repositories.ChannelMemberRepository;
import com.aws.services.ChannelMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChannelMemberServiceImpl implements ChannelMemberService {

    @Autowired
    private ChannelMemberRepository channelMemberRepository;

}
