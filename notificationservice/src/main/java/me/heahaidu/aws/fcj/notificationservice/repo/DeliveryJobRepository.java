package me.heahaidu.aws.fcj.notificationservice.repo;

import me.heahaidu.aws.fcj.notificationservice.domain.Enums;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class DeliveryJobRepository {
    private final JdbcTemplate jdbc;

    public DeliveryJobRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void createJob(UUID id, UUID notificationId, UUID userUuid, Enums.Channel channel) {
        jdbc.update("""
      INSERT INTO notification_delivery_job(id, notification_id, user_uuid, channel)
      VALUES (?, ?, ?, ?)
    """, id, notificationId, userUuid, (short) (channel.ordinal() + 1));
    }

    public List<UUID> claimPendingJobIds(String workerId, int limit) {
        return jdbc.queryForList("""
      WITH cte AS (
        SELECT id
        FROM notification_delivery_job
        WHERE status = 0 AND next_attempt_at <= now()
        ORDER BY next_attempt_at, id
        FOR UPDATE SKIP LOCKED
        LIMIT ?
      )
      UPDATE notification_delivery_job j
      SET status = 1, locked_at = now(), locked_by = ?, updated_at = now()
      FROM cte
      WHERE j.id = cte.id
      RETURNING j.id
    """, UUID.class, limit, workerId);
    }

    public void markSent(UUID jobId) {
        jdbc.update("""
      UPDATE notification_delivery_job
      SET status = 2, updated_at = now()
      WHERE id = ?
    """, jobId);
    }

    public void markFailed(UUID jobId, String error, boolean dead) {
        short status = (short) (dead ? 4 : 3);

        jdbc.update("""
      UPDATE notification_delivery_job
      SET status = ?,
          attempts = attempts + 1,
          next_attempt_at = now() + (attempts + 1) * interval '10 seconds',
          last_error = ?,
          updated_at = now()
      WHERE id = ?
    """, status, error, jobId);
    }
}