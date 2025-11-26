package com.aws.services.impl;

import com.aws.pojo.Channel;
import com.aws.pojo.ChannelFollower;
import com.aws.repositories.ChannelFollowerRepository;
import com.aws.services.ChannelFollowerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ChannelFollowerServiceImpl implements ChannelFollowerService {

    @Autowired
    private ChannelFollowerRepository channelFollowerRepository;


    @Override
    public ChannelFollower findById(UUID uuid) {
        Optional<ChannelFollower> channelFollower = this.channelFollowerRepository.findById(uuid);
        return channelFollower.orElse(null);
    }

    @Transactional
    @Override
    public ChannelFollower addOrUpdateChannelFollower(ChannelFollower channelFollower) {
        return this.channelFollowerRepository.save(channelFollower);
    }

    @Override
    public void deleteChannelFollower(ChannelFollower channelFollower) {
        this.channelFollowerRepository.delete(channelFollower);
    }
}
