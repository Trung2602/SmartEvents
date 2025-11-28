package com.aws.services.impl;

import com.aws.pojo.Channel;
import com.aws.repositories.ChannelRepository;
import com.aws.services.ChannelService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ChannelServiceImpl implements ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Override
    public Channel getChannelByUuid(UUID uuid) {
        Optional<Channel> channel = channelRepository.findById(uuid);
        return channel.orElse(null);
    }

    @Override
    public Page<Channel> searchChannelsByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uuid"));
        return this.channelRepository.findByName(name, pageable);
    }

    @Override
    public Channel addOrUpdateChannel(Channel channel) {
        return this.channelRepository.save(channel);
    }

    @Override
    public Channel getChannelByUUID(UUID uuid) {
        Optional<Channel> channel = this.channelRepository.findById(uuid);
        return channel.orElse(null);
    }

    @Transactional
    @Override
    public void deleteChannel(Channel channel) {
        this.channelRepository.delete(channel);
    }

    @Override
    public Page<Channel> getChannelsByOwner(UUID ownerUuid, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return channelRepository.findByOwner_Uuid(ownerUuid, pageable);
    }
}
