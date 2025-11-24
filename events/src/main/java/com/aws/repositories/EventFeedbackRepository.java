package com.aws.repositories;

import com.aws.pojo.Event;
import com.aws.pojo.EventFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, UUID> {

    Page<EventFeedback> findByEvent_Uuid(UUID eventUuid);

    Page<EventFeedback> findByUser_Uuid(UUID userUuid);

    Optional<EventFeedback> findByEvent_UuidAndUser_Uuid(UUID eventUuid, UUID userUuid);

}
