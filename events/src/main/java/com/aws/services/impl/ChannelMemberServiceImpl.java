package com.aws.services.impl;

import com.aws.pojo.ChannelMember;
import com.aws.repositories.ChannelMemberRepository;
import com.aws.services.ChannelMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ChannelMemberServiceImpl implements ChannelMemberService {

    @Autowired
    private ChannelMemberRepository channelMemberRepository;

    @Override
    public ChannelMember addOrUpdateChannelMember(ChannelMember channelMember) {
        return this.channelMemberRepository.save(channelMember);
    }

    @Override
    public void deleteChannelMember(ChannelMember channelMember) {
        this.channelMemberRepository.delete(channelMember);
    }

    @Override
    public ChannelMember findById(UUID uuid) {
        Optional<ChannelMember> channelMember = this.channelMemberRepository.findById(uuid);
        return channelMember.orElse(null);
    }
}
