package me.heahaidu.aws.fcj.eventservice.controller.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEventRequest {

    @NotNull(message = "Page UUID is required")
    private UUID pageUuid;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 255)
    private String location;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "Category is required")
    @Size(max = 100)
    private String category;

    @Size(max = 100)
    private String subcategory;

    private List<String> tags;

    @NotBlank(message = "Country code is required")
    @Size(min = 2, max = 3)
    private String countryCode;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private String timezone = "UTC";

    private List<String> imageUrls;

    @Pattern(regexp = "^https?://.*", message = "Video URL must be a valid HTTP/HTTPS URL")
    private String videoUrl;

    private List<UUID> hostUuids;

    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;

    private String visibility = "PUBLIC";
}