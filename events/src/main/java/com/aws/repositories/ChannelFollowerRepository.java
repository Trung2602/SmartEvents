package com.aws.repositories;

import com.aws.pojo.ChannelFollower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChannelFollowerRepository extends JpaRepository<ChannelFollower, UUID> {
}
