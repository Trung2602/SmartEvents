package com.aws.repositories;

import com.aws.pojo.Account;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByAccount(Account account);

    User findByAccountUuid(UUID accountUuid);

    Page<User> findByFirstNameContainingIgnoreCase(String firstName);

    Page<User> findByLastNameContainingIgnoreCase(String lastName);

    Page<User> findByCity(String city);

    Page<User> findByCityContainingIgnoreCase(String city);
}
