package com.aws.repositories;

import com.aws.pojo.Event;
import com.aws.pojo.EventFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, UUID> {
}
