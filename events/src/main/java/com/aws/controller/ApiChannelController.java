package com.aws.controller;


import com.aws.pojo.Channel;
import com.aws.services.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiChannelController {

    @Autowired
    private ChannelService channelService;

    @GetMapping("/channels/{ownerUuid}")
    public ResponseEntity<Page<Channel>> getChannelsByOwner(@PathVariable UUID ownerUuid,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<Channel> channels = channelService.getChannelsByOwner(ownerUuid, page, size);
        return ResponseEntity.ok(channels);
    }

    @PostMapping("/channel-update")
    public ResponseEntity<Channel> createOrUpdateChannel(@RequestBody Channel channel) {
        Channel c= channelService.addOrUpdateChannel(channel);
        return ResponseEntity.ok(channelService.addOrUpdateChannel(channel));
    }

    @DeleteMapping("/channel-delete/{uuid}")
    public ResponseEntity<?> deleteChannel(@PathVariable UUID uuid) {
        Channel channel = channelService.getChannelByUuid(uuid);
        if (channel != null) {
            channelService.deleteChannel(channel);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
