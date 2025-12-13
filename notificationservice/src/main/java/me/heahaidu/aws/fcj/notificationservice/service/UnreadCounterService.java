package me.heahaidu.aws.fcj.notificationservice.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UnreadCounterService {
    private final StringRedisTemplate redis;

    public UnreadCounterService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String key(UUID userUuid) {
        return "notif:unread:" + userUuid;
    }

    public void increment(UUID userUuid) {
        redis.opsForValue().increment(key(userUuid));
    }

    public void reset(UUID userUuid) {
        redis.opsForValue().set(key(userUuid), "0");
    }
}