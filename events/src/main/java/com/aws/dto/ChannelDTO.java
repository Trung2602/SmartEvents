package com.aws.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChannelDTO {

    private UUID uuid;
    private String name;
    private String description;
    private String channelType;
//    private String avatarUrl;
//    private String coverImageUrl;
//    private Boolean isPublic;
//    private Boolean isVerified;
    private Integer followerCount;
    private Integer eventCount;
    private UUID ownerUuid;
    private String status;
    private LocalDateTime updatedAt;
}
