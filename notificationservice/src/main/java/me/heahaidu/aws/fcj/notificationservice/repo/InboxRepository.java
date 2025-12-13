package me.heahaidu.aws.fcj.notificationservice.repo;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class InboxRepository {
    private final JdbcTemplate jdbc;

    public InboxRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean tryInsert(String source, String messageId, String payloadJson) {
        try {
            jdbc.update("""
        INSERT INTO notification_inbox(source, message_id, payload)
        VALUES (?, ?, CAST(? AS jsonb))
      """, source, messageId, payloadJson);
            return true;
        } catch (DuplicateKeyException dup) {
            return false;
        }
    }
}