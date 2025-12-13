package com.aws.services.impl;

import com.aws.pojo.UserProfile;
import com.aws.repositories.UserProfileRepository;
import com.aws.services.UserProfileService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    @Override
    public UserProfile addOrUpdateUserProfile(UserProfile userProfile) {
        return this.userProfileRepository.save(userProfile);
    }

    @Override
    public void deleteUserProfile(UserProfile userProfile) {
        this.userProfileRepository.delete(userProfile);
    }

    @Override
    public UserProfile findUserProfileById(UUID uuid) {
        Optional<UserProfile> userProfile = this.userProfileRepository.findById(uuid);
        return userProfile.orElse(null);
    }
}
