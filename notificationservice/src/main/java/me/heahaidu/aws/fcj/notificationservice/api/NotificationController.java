package me.heahaidu.aws.fcj.notificationservice.api;

import me.heahaidu.aws.fcj.notificationservice.service.UnreadCounterService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/v1/notifications")
public class NotificationController {

    private final JdbcTemplate jdbc;
    private final UnreadCounterService unreadCounter;

    public NotificationController(JdbcTemplate jdbc, UnreadCounterService unreadCounter) {
        this.jdbc = jdbc;
        this.unreadCounter = unreadCounter;
    }

    private UUID user(@RequestHeader("X-User-Id") String userId) {
        return UUID.fromString(userId);
    }

    public record NotificationItem(
            UUID id, String type, short priority, String title, String body,
            String deepLink, String imageUrl, OffsetDateTime createdAt, boolean isRead
    ) {}

    @GetMapping
    public List<NotificationItem> list(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) OffsetDateTime cursorCreatedAt,
            @RequestParam(required = false) UUID cursorId,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit
    ) {
        UUID u = user(userId);

        OffsetDateTime readAllBefore = jdbc.query("""
      SELECT COALESCE(
        (SELECT read_all_before FROM notification_read_marker WHERE user_uuid = ?),
        'epoch'::timestamptz
      ) AS v
    """, rs -> { rs.next(); return rs.getObject("v", OffsetDateTime.class); }, u);

        String cursorClause = (cursorCreatedAt == null || cursorId == null)
                ? ""
                : " AND (n.created_at, n.id) < (?, ?) ";

        var args = new ArrayList<>();
        args.add(readAllBefore);
        args.add(u);
        if (!cursorClause.isEmpty()) {
            args.add(cursorCreatedAt);
            args.add(cursorId);
        }
        args.add(limit);

        return jdbc.query("""
      SELECT n.id, n.type, n.priority, n.title, n.body, n.deep_link, n.image_url, n.created_at,
             (n.created_at <= ? OR rr.notification_id IS NOT NULL) AS is_read
      FROM notification n
      LEFT JOIN notification_read_receipt rr
        ON rr.user_uuid = n.user_uuid AND rr.notification_id = n.id
      WHERE n.user_uuid = ?
        AND n.deleted_at IS NULL
        AND (n.expires_at IS NULL OR n.expires_at > now())
      """ + cursorClause + """
      ORDER BY n.created_at DESC, n.id DESC
      LIMIT ?
    """, (rs, rowNum) -> new NotificationItem(
                rs.getObject("id", UUID.class),
                rs.getString("type"),
                rs.getShort("priority"),
                rs.getString("title"),
                rs.getString("body"),
                rs.getString("deep_link"),
                rs.getString("image_url"),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getBoolean("is_read")
        ), args.toArray());
    }

    @PostMapping("/{id}/read")
    public void markRead(@RequestHeader("X-User-Id") String userId, @PathVariable UUID id) {
        UUID u = user(userId);
        jdbc.update("""
      INSERT INTO notification_read_receipt(user_uuid, notification_id)
      VALUES (?, ?)
      ON CONFLICT DO NOTHING
    """, u, id);
    }

    @PostMapping("/read-all")
    public void readAll(@RequestHeader("X-User-Id") String userId) {
        UUID u = user(userId);
        jdbc.update("""
      INSERT INTO notification_read_marker(user_uuid, read_all_before)
      VALUES (?, now())
      ON CONFLICT (user_uuid)
      DO UPDATE SET read_all_before = GREATEST(notification_read_marker.read_all_before, EXCLUDED.read_all_before),
                    updated_at = now()
    """, u);

        unreadCounter.reset(u);
    }
}