package com.aws.repositories;

import com.aws.pojo.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface  AccountRepository extends JpaRepository<Account, UUID> {

    Page<Account> findByName(String name, Pageable pageable);

    Optional<Account> findByEmail(String email);

    Page<Account> findByRole(Account.Role role, Pageable pageable);

    Page<Account> findByIsActive(Boolean isActive, Pageable pageable);

}
