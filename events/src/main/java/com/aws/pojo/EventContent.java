package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "event_content")
public class EventContent {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @ManyToOne
    @JoinColumn(name = "previous_version_uuid")
    public EventContent previousVersion;

    @Column(nullable = false, length = 255)
    public String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String description;

    @Column(nullable = false, length = 255)
    public String location;

    @Column(nullable = false, length = 100)
    public String city;

    @Column(nullable = false, length = 100)
    public String category;

    @Column(columnDefinition = "TEXT")
    public String tags;

    @Column(name = "country_code", nullable = false, length = 10)
    public String countryCode;

    @Column(name = "start_time", nullable = false)
    public LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    public LocalDateTime endTime;

    @Column(name = "image_url", length = 500)
    public String imageUrl;

    @ElementCollection
    @CollectionTable(name = "event_content_hosts", joinColumns = @JoinColumn(name = "event_content_uuid"))
    @Column(name = "host_uuid")
    public List<UUID> hostUuids;

    @ManyToOne
    @JoinColumn(name = "edited_by", nullable = false)
    public Account editedBy;

    @Column(name = "edit_reason", length = 500)
    public String editReason;

    @Column(name = "is_current_version")
    public Boolean isCurrentVersion = true;
}