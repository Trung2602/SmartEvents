package com.aws.repositories;

import com.aws.pojo.Account;
import com.aws.pojo.Channel;
import com.aws.pojo.ChannelFollower;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelFollowerRepository extends JpaRepository<ChannelFollower, UUID> {
    Page<ChannelFollower> findByFollower(Account follower, Pageable pageable);

    Page<ChannelFollower> findByNotificationEnabled(Boolean enabled, Pageable pageable);

}
