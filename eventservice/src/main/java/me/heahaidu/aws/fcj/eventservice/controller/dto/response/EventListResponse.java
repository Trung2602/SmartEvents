package me.heahaidu.aws.fcj.eventservice.controller.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record EventListResponse(List<EventResponse> items, String nextCursor, boolean hasNext) {
}
