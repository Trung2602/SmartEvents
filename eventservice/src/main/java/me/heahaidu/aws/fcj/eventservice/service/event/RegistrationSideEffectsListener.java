package me.heahaidu.aws.fcj.eventservice.service.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.heahaidu.aws.fcj.eventservice.domain.event.NotificationEvent;
import me.heahaidu.aws.fcj.eventservice.domain.event.RegistrationEventCommited;
import me.heahaidu.aws.fcj.eventservice.messaging.NotificationEventProducer;
import me.heahaidu.aws.fcj.eventservice.repository.entity.EventContent;
import me.heahaidu.aws.fcj.eventservice.repository.entity.EventRegistration;
import me.heahaidu.aws.fcj.eventservice.service.EmailService;
import me.heahaidu.aws.fcj.eventservice.service.QrService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationSideEffectsListener {
    private final NotificationEventProducer notificationEventProducer;
    private final EmailService emailService;
    private final QrService  qrService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendEmail(RegistrationEventCommited event) {
        sendConfirmationEmail(event.registration(), event.email(), event.content());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishNotification(RegistrationEventCommited event) {
        notificationEventProducer.publish(new NotificationEvent(
                event.content().getEventUuid(),
                event.registration().getUserUuid(),
                "EVENT_REGISTERED",
                "Ticket Confirmed",
                "You have successfully booked tickets for " + event.content().getTitle().toLowerCase(),
                "",
                "",
                Instant.now(),
                1
        ));
    }

    private void sendConfirmationEmail(
            EventRegistration registration,
            String email,
            EventContent eventContent
    ) {
        try {
            byte[] qrImage = qrService.generateQrCodeImage(registration.getUuid());

            emailService.sendRegistrationConfirmation(
                    EmailService.RegistrationEmailRequest.builder()
                            .userEmail(email)
                            .userUuid(registration.getUuid())
                            .eventContent(eventContent)
                            .qrImage(qrImage)
                            .build()
            );

        } catch (Exception e) {
            log.error("Failed to send confirmation email for registration: {}", registration.getUuid(), e);
        }
    }
}
