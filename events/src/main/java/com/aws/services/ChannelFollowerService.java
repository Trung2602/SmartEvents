package com.aws.services;

import com.aws.pojo.ChannelFollower;

import java.util.UUID;

public interface ChannelFollowerService {
    ChannelFollower findById(UUID uuid);
    ChannelFollower addOrUpdateChannelFollower(ChannelFollower channelFollower);
    void deleteChannelFollower(ChannelFollower channelFollower);
}
