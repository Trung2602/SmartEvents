package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "image_analysis")
public class ImageAnalysis {

    @Id
    @GeneratedValue
    public UUID uuid;

    @ManyToOne
    @JoinColumn(name = "event_uuid", nullable = false)
    public Event event;

    @Column(name = "s3_key", nullable = false, length = 500)
    public String s3Key;

    @Column(name = "s3_bucket", nullable = false, length = 100)
    public String s3Bucket;

    @Column(name = "detected_labels", nullable = false, columnDefinition = "TEXT")
    public String detectedLabels;

    @Column(name = "confidence_score", precision = 4, scale = 3, nullable = false)
    public BigDecimal confidenceScore;

    @Column(name = "image_size_bytes")
    public Long imageSizeBytes;

    @Column(name = "image_dimensions", columnDefinition = "TEXT")
    public String imageDimensions;
}

