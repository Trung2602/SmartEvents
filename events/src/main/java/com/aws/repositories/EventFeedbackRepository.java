package com.aws.repositories;

import com.aws.pojo.Event;
import com.aws.pojo.EventFeedback;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, UUID> {

    Page<EventFeedback> findByEvent(Event event, Pageable pageable);

    Page<EventFeedback> findByUser(User user, Pageable pageable);

    Optional<EventFeedback> findByEventAndUser(Event event, User user);

}
