package com.aws.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PageMemberDTO {

    private UUID uuid;
    private UUID channelUuid;
    private UUID userUuid;
    private String role;
    private String permissions;
    private String invitationStatus;
    private UUID invitedBy;
    private LocalDateTime joinedAt;
}
