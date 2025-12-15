package me.heahaidu.aws.fcj.notificationservice.service.impl;

import com.github.f4b6a3.uuid.UuidCreator;
import me.heahaidu.aws.fcj.notificationservice.domain.event.NotificationEvent;
import me.heahaidu.aws.fcj.notificationservice.domain.event.NotificationStoredEvent;
import me.heahaidu.aws.fcj.notificationservice.repository.entity.NotificationEntity;
import me.heahaidu.aws.fcj.notificationservice.repository.jpa.NotificationJpaRepository;
import me.heahaidu.aws.fcj.notificationservice.service.port.NotificationIngestService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class NotificationIngestServiceImpl implements NotificationIngestService {

    private final NotificationJpaRepository notificationRepo;
    private final ApplicationEventPublisher publisher;

    public NotificationIngestServiceImpl(NotificationJpaRepository notificationRepo, ApplicationEventPublisher publisher) {
        this.notificationRepo = notificationRepo;
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public UUID ingest(NotificationEvent event) {
        UUID id = UuidCreator.getTimeOrderedEpoch();

        var n = new NotificationEntity();
        n.setUuid(id);
        n.setUserUuid(event.userUuid());
        n.setType(event.eventType());
        n.setPriority((short) 1);
        n.setTitle(event.title());
        n.setBody(event.body());
        n.setDeepLink(event.deepLink());
        n.setImageUrl(event.imageUrl());
        n.setCreatedAt(Instant.now());

        notificationRepo.save(n);

        publisher.publishEvent(new NotificationStoredEvent(
                n.getUuid(), n.getUserUuid(), n.getType(), n.getPriority(),
                n.getTitle(), n.getBody(), n.getDeepLink(), n.getImageUrl(), n.getCreatedAt()
        ));

        return id;
    }
}