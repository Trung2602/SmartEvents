package me.heahaidu.aws.fcj.notificationservice.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.heahaidu.aws.fcj.notificationservice.service.NotificationIngestService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class EventConsumer {

    private final NotificationIngestService ingestService;
    private final ObjectMapper objectMapper;

    public EventConsumer(NotificationIngestService ingestService, ObjectMapper objectMapper) {
        this.ingestService = ingestService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "user-events", containerFactory = "kafkaListenerContainerFactory")
    public void onMessage(byte[] payload, Acknowledgment ack) {
        try {
            NotificationEvent event = objectMapper.readValue(payload, NotificationEvent.class);
            ingestService.ingest("kafka:user-events", event);
            ack.acknowledge();
        } catch (Exception e) {
            throw new RuntimeException("Cannot parse/ingest Kafka message", e);
        }
    }
}