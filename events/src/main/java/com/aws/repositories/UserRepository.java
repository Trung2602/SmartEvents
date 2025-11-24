package com.aws.repositories;

import com.aws.pojo.Account;
import com.aws.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByAccount(Account account);

    User findByAccountUuid(UUID accountUuid);

    List<User> findByFirstNameContainingIgnoreCase(String firstName);

    List<User> findByLastNameContainingIgnoreCase(String lastName);

    List<User> findByCity(String city);

    List<User> findByCityContainingIgnoreCase(String city);
}
