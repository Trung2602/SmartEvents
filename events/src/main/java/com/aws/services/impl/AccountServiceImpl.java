package com.aws.services.impl;


import com.aws.pojo.Account;
import com.aws.repositories.AccountRepository;
import com.aws.services.AccountService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service("userDetailsService")
public class AccountServiceImpl implements AccountService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    @Override
    public Account addOrUpdateAccount(Account a) {
        if(a.getPasswordHash() != null && !a.getPasswordHash().isEmpty())
        {
            a.setPasswordHash(this.passwordEncoder.encode(a.getPasswordHash()));
        }else if(a.getEmail() != null)
        {
            Optional<Account> userSaved = this.accountRepository.findByEmail(a.getEmail());
            userSaved.ifPresent(account -> a.setPasswordHash(account.getPasswordHash()));
        }
        return this.accountRepository.save(a);
    }

    @Override
    public Account getAccountByEmail(String email) {
        Optional<Account> account = this.accountRepository.findByEmail(email);
        return account.orElse(null);
    }

    @Override
    public Page<Account> searchAccountsByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return this.accountRepository.findByName(name, pageable);
    }

    @Override
    public Page<Account> searchAccountsByRole(String role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return this.accountRepository.findByRole(Account.Role.valueOf(role), pageable);
    }

    @Transactional
    @Override
    public void deactivateAccount(UUID userId) {
        Account acc = accountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        acc.setIsActive(false);
        accountRepository.save(acc);
    }

    @Transactional
    @Override
    public void activateAccount(UUID userId) {
        Account acc = accountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        acc.setIsActive(true);
        accountRepository.save(acc);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account u = this.getAccountByEmail(email);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid email!");

        }
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(), u.getPasswordHash(), authorities);
    }

    @Override
    public boolean authenticate(String email, String password) {
        Optional<Account> a = this.accountRepository.findByEmail(email);
        if (a.isPresent()) {
            Account account = a.get();
            account.setLastLoginAt(LocalDateTime.now());
            accountRepository.save(account);
            return passwordEncoder.matches(password, account.getPasswordHash());
        }
        return false;
    }
}
