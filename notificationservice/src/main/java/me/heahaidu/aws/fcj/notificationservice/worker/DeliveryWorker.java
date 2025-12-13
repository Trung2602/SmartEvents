package me.heahaidu.aws.fcj.notificationservice.worker;

import me.heahaidu.aws.fcj.notificationservice.repo.DeliveryJobRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DeliveryWorker {

    private final DeliveryJobRepository jobs;
    private final String workerId = UUID.randomUUID().toString();

    public DeliveryWorker(DeliveryJobRepository jobs) {
        this.jobs = jobs;
    }

    @Scheduled(fixedDelay = 200)
    public void runOnce() {
        var jobIds = jobs.claimPendingJobIds(workerId, 200);
        for (var jobId : jobIds) {
            try {
                // TODO: load notification + devices, call FCM/APNS/Email/SMS
                jobs.markSent(jobId);
            } catch (Exception e) {
                jobs.markFailed(jobId, e.getMessage(), false);
            }
        }
    }
}