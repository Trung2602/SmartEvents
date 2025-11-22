package com.aws.repositories;

import com.aws.pojo.ImageAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageAnalysisRepository extends JpaRepository<ImageAnalysis, UUID> {
}
