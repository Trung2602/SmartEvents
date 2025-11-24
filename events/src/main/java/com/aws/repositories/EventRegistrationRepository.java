package com.aws.repositories;

import com.aws.pojo.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {

    List<EventRegistration> findByEvent_Uuid(UUID eventUuid);

    List<EventRegistration> findByUser_Uuid(UUID userUuid);

    Optional<EventRegistration> findByEvent_UuidAndUser_Uuid(UUID eventUuid, UUID userUuid);

    List<EventRegistration> findByEvent_UuidAndRegistrationStatus(UUID eventUuid, EventRegistration.RegistrationStatus status);

    long countByEvent_Uuid(UUID eventUuid);
}
