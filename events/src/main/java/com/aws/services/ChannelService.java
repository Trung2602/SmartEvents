package com.aws.services;

import com.aws.pojo.Channel;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ChannelService {
    Page<Channel> searchChannelsByName(String name, int page, int size);
    Channel addOrUpdateChannel(Channel channel);
    Channel getChannelByUUID(UUID uuid);
    void deleteChannel(Channel channel);

}
