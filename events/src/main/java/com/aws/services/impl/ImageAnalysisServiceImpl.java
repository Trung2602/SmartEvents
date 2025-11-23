package com.aws.services.impl;

import com.aws.repositories.ImageAnalysisRepository;
import com.aws.services.ImageAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageAnalysisServiceImpl implements ImageAnalysisService {

    @Autowired
    private ImageAnalysisRepository imageAnalysisRepository;

}
