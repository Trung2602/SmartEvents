package me.heahaidu.aws.fcj.eventservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.heahaidu.aws.fcj.eventservice.repository.dto.EventContentProjection;
import me.heahaidu.aws.fcj.eventservice.repository.entity.Event;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Async("emailTaskExecutor")
    public void sendRegistrationConfirmation(RegistrationEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(request.getUserEmail());
            helper.setSubject("🎉 Registration Confirmed - " + request.event.getTitle());

            Context context = new Context();
            context.setVariable("eventTitle", request.event.getTitle());
            context.setVariable("eventDate", formatDate(request.event.getStartTime()));
            context.setVariable("eventTime", formatTime(request.event.getEndTime()));
            context.setVariable("eventLocation", request.event.getLocation());
            context.setVariable("eventUrl", frontendBaseUrl + "/events/" + request.event.getEventUuid());
            context.setVariable("qrCodeCid", "qrcode");

            String htmlContent = templateEngine.process("registration-confirmation", context);
            helper.setText(htmlContent, true);

            // Attach QR code as inline image
            helper.addInline("qrcode", new ByteArrayResource(request.qrImage), "image/png");

            mailSender.send(message);
            log.info("Registration confirmation email sent to: {}", request.getUserEmail());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send registration email to: {}", request.getUserEmail(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async("emailTaskExecutor")
    public void sendCancellationNotification(CancellationEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(request.getUserEmail());
            helper.setSubject("Registration Cancelled - " + request.getEventTitle());

            Context context = new Context();
            context.setVariable("userName", request.getUserName());
            context.setVariable("eventTitle", request.getEventTitle());
            context.setVariable("cancellationReason", request.getReason());
            context.setVariable("browseEventsUrl", frontendBaseUrl + "/events");

            String htmlContent = templateEngine.process("registration-cancellation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Cancellation email sent to: {}", request.getUserEmail());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send cancellation email to: {}", request.getUserEmail(), e);
        }
    }

    @Async("emailTaskExecutor")
    public void sendEventReminder(ReminderEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(request.getUserEmail());
            helper.setSubject("⏰ Reminder: " + request.getEventTitle() + " is tomorrow!");

            Context context = new Context();
            context.setVariable("userName", request.getUserName());
            context.setVariable("eventTitle", request.getEventTitle());
            context.setVariable("eventDate", formatDate(request.getEventStartTime()));
            context.setVariable("eventTime", formatTime(request.getEventStartTime()));
            context.setVariable("eventLocation", request.getEventLocation());
            context.setVariable("ticketCode", request.getTicketCode());
            context.setVariable("qrCodeCid", "qrcode");

            String htmlContent = templateEngine.process("event-reminder", context);
            helper.setText(htmlContent, true);

            helper.addInline("qrcode", new ByteArrayResource(request.getQrCodeImage()), "image/png");

            mailSender.send(message);
            log.info("Reminder email sent to: {}", request.getUserEmail());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send reminder email to: {}", request.getUserEmail(), e);
        }
    }

    private String formatDate(Instant instant) {
        return DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy")
                .withZone(ZoneId.systemDefault())
                .format(instant);
    }

    private String formatTime(Instant instant) {
        return DateTimeFormatter.ofPattern("h:mm a")
                .withZone(ZoneId.systemDefault())
                .format(instant);
    }

    // ==================== Request DTOs ====================

    @lombok.Data
    @lombok.Builder
    public static class RegistrationEmailRequest {
        private String userEmail;
        private UUID userUuid;
        private EventContentProjection event;
        private byte[] qrImage;
    }

    @lombok.Data
    @lombok.Builder
    public static class CancellationEmailRequest {
        private String userEmail;
        private String userName;
        private String eventTitle;
        private String reason;
    }

    @lombok.Data
    @lombok.Builder
    public static class ReminderEmailRequest {
        private String userEmail;
        private String userName;
        private String eventTitle;
        private Instant eventStartTime;
        private String eventLocation;
        private String ticketCode;
        private byte[] qrCodeImage;
    }
}