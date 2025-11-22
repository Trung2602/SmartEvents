package com.aws.repositories;

import com.aws.pojo.EventEmbedding;
import com.aws.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventEmbeddingRepository extends JpaRepository<EventEmbedding, UUID> {
}
