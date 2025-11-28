package com.aws.services;


import com.aws.pojo.ChannelMember;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ChannelMemberService {
    ChannelMember addOrUpdateChannelMember(ChannelMember channelMember);
    void deleteChannelMember(ChannelMember channelMember);
    ChannelMember findById(UUID uuid);
    public Page<ChannelMember> getChannelMembersByChannelUuid(UUID channelUuid, int page, int size);
    public Page<ChannelMember> getChannelMembersByUserUuid(UUID userUuid, int page, int size);
    public Page<ChannelMember> getChannelMembersByInvitationStatus(String invitationStatus, int page, int size);
}
