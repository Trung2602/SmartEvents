package com.aws.repositories;

import com.aws.pojo.ChannelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChannelMemberRepository extends JpaRepository<ChannelMember, UUID> {
}
