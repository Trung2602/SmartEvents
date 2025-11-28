package com.aws.repositories;

import com.aws.pojo.Account;
import com.aws.pojo.Channel;
import com.aws.pojo.ChannelMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelMemberRepository extends JpaRepository<ChannelMember, UUID> {

    Page<ChannelMember> findByChannel_Uuid(UUID channelUuid, Pageable pageable);

    Page<ChannelMember> findByUsers_Uuid(UUID usersUuid, Pageable pageable);

    Page<ChannelMember> findByInvitationStatus(String invitationStatus, Pageable pageable);
}
