package com.aws.services;

import com.aws.pojo.Account;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.UUID;

public interface AccountService extends UserDetailsService {
    Account addOrUpdateAccount(Account a);
    Account getAccountByEmail(String email);
    boolean authenticate(String email, String password);

    Page<Account> searchAccountsByName(String name, int page, int size);
    Page<Account> searchAccountsByRole(String role, int page, int size);


    void deactivateAccount(UUID userId);

    void activateAccount(UUID userId);
}
