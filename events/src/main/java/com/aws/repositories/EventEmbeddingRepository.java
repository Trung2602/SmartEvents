package com.aws.repositories;

import com.aws.pojo.EventEmbedding;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventEmbeddingRepository extends JpaRepository<EventEmbedding, UUID> {

    Page<EventEmbedding> findByEvent_Uuid(UUID eventUuid);
}
