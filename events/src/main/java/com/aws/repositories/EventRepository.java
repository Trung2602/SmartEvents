package com.aws.repositories;

import com.aws.pojo.Account;
import com.aws.pojo.Admin;
import com.aws.pojo.Channel;
import com.aws.pojo.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    Page<Event> findByChannel(Channel channel, Pageable pageable);

    Page<Event> findByChannelUuid(UUID channelUuid, Pageable pageable);

    Page<Event> findByStatus(Event.Status status, Pageable pageable);

    Page<Event> findByChannelUuidAndStatus(UUID channelUuid, Event.Status status, Pageable pageable);

    Page<Event> findByCreatedBy(Account creator, Pageable pageable);

    Page<Event> findByCreatedByUuid(UUID creatorUuid, Pageable pageable);

    Page<Event> findByAcceptedBy(Admin acceptedBy, Pageable pageable);

    Page<Event> findByAcceptedByUuid(UUID acceptedByUuid, Pageable pageable);
}
