package me.heahaidu.aws.fcj.notificationservice.service.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.heahaidu.aws.fcj.notificationservice.domain.event.NotificationEvent;
import me.heahaidu.aws.fcj.notificationservice.service.port.NotificationIngestService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class KafkaNotificationEventConsumer {

    private final ObjectMapper om;
    private final NotificationIngestService ingestService;

    public KafkaNotificationEventConsumer(ObjectMapper om, NotificationIngestService ingestService) {
        this.om = om;
        this.ingestService = ingestService;
    }

    @KafkaListener(topics = "notification-events", containerFactory = "kafkaListenerContainerFactory")
    public void onMessage(byte[] payload, Acknowledgment ack) throws Exception {
        NotificationEvent event = om.readValue(payload, NotificationEvent.class);
        ingestService.ingest(event);
        ack.acknowledge();
    }
}