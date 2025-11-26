package com.aws.repositories;

import com.aws.pojo.Event;
import com.aws.pojo.EventRegistration;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {

    Page<EventRegistration> findByEvent(Event event, Pageable pageable);

    Page<EventRegistration> findByUser(User user, Pageable pageable);

    Optional<EventRegistration> findByEventAndUser(Event event, User user);

    Page<EventRegistration> findByEventAndRegistrationStatus(Event event, EventRegistration.RegistrationStatus status, Pageable pageable);

}
