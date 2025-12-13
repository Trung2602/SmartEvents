package me.heahaidu.aws.fcj.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.f4b6a3.uuid.UuidCreator;
import me.heahaidu.aws.fcj.notificationservice.domain.Enums;
import me.heahaidu.aws.fcj.notificationservice.kafka.NotificationEvent;
import me.heahaidu.aws.fcj.notificationservice.repo.DeliveryJobRepository;
import me.heahaidu.aws.fcj.notificationservice.repo.InboxRepository;
import me.heahaidu.aws.fcj.notificationservice.repo.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class NotificationIngestService {

    private final InboxRepository inbox;
    private final NotificationRepository notifications;
    private final DeliveryJobRepository jobs;
    private final UnreadCounterService unreadCounter;
    private final ObjectMapper om;

    public NotificationIngestService(InboxRepository inbox,
                                     NotificationRepository notifications,
                                     DeliveryJobRepository jobs,
                                     UnreadCounterService unreadCounter,
                                     ObjectMapper om) {
        this.inbox = inbox;
        this.notifications = notifications;
        this.jobs = jobs;
        this.unreadCounter = unreadCounter;
        this.om = om;
    }

    @Transactional
    public void ingest(String source, NotificationEvent event) {
        final String payloadJson;
        try {
            payloadJson = om.writeValueAsString(event);
        } catch (Exception e) {
            throw new RuntimeException("Cannot serialize event", e);
        }

        boolean firstTime = inbox.tryInsert(source, event.eventId(), payloadJson);
        if (!firstTime) return;

        // UUIDv7 (Unix epoch time-based) theo uuid-creator  ([github.com](https://github.com/f4b6a3/uuid-creator?utm_source=openai))
        UUID notifId = UuidCreator.getTimeOrderedEpoch();

        short prio = Enums.priorityToCode(Enums.Priority.NORMAL);

        notifications.insert(
                notifId,
                event.userUuid(),
                event.eventType(),
                prio,
                event.title(),
                event.body(),
                event.deepLink(),
                event.imageUrl(),
                "{}"
        );

        // Demo: luôn tạo PUSH job (production: check preference + quiet hours + device)
        UUID jobId = UuidCreator.getTimeOrderedEpoch();
        jobs.createJob(jobId, notifId, event.userUuid(), Enums.Channel.PUSH);

        // best-effort cache
        unreadCounter.increment(event.userUuid());
    }
}