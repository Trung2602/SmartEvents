package com.aws.services;

import com.aws.pojo.ChannelFollower;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ChannelFollowerService {
    ChannelFollower findById(UUID uuid);
    ChannelFollower addOrUpdateChannelFollower(ChannelFollower channelFollower);
    void deleteChannelFollower(ChannelFollower channelFollower);
    public Page<ChannelFollower> getChannelFollowersByChannelUuid(UUID channelUuid, int page, int size);
    public Page<ChannelFollower> getChannelFollowersByFollowerUuid(UUID followerlUuid, int page, int size);;
}
