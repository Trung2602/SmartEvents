package com.aws.services;


import com.aws.pojo.ChannelMember;

import java.util.UUID;

public interface ChannelMemberService {
    ChannelMember addOrUpdateChannelMember(ChannelMember channelMember);
    void deleteChannelMember(ChannelMember channelMember);
    ChannelMember findById(UUID uuid);
}
