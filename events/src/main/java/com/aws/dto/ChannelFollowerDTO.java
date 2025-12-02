package com.aws.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ChannelFollowerDTO {

    private UUID uuid;
    private UUID channelUuid;
    private UUID followerUuid;
    private Boolean notificationEnabled;
}
