package com.aws.repositories;

import com.aws.pojo.EventContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventContentRepository extends JpaRepository<EventContent, UUID> {
}
