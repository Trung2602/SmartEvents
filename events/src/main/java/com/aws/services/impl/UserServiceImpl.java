package com.aws.services.impl;

import com.aws.repositories.UserProfileRepository;
import com.aws.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserProfileRepository userRepository;
}
