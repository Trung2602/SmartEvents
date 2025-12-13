package me.heahaidu.aws.fcj.notificationservice.repo;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class NotificationRepository {
    private final JdbcTemplate jdbc;

    public NotificationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void insert(UUID id, UUID userUuid, String type, short priority,
                       String title, String body, String deepLink, String imageUrl, String dataJson) {

        jdbc.update("""
      INSERT INTO notification(id, user_uuid, type, priority, title, body, deep_link, image_url, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS jsonb))
    """, id, userUuid, type, priority, title, body, deepLink, imageUrl, dataJson);
    }
}