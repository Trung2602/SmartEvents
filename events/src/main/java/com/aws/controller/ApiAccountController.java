package com.aws.controller;


import com.aws.dto.AccountDTO;
import com.aws.pojo.Account;
import com.aws.pojo.ChannelMember;
import com.aws.services.AccountService;
import com.aws.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;

@RestController
@RequestMapping("/api")
public class ApiAccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Account a) {
        if (a.getEmail() == null || a.getPasswordHash() == null) {
            return ResponseEntity.badRequest().body("Username hoặc password không được để trống");
        }

        if (this.accountService.authenticate(a.getEmail(), a.getPasswordHash())) {
            try {
                String token = JwtUtils.generateToken(a.getEmail());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<Account> getProfile(Principal principal) {
        return new ResponseEntity<>(this.accountService.getAccountByEmail(principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/register/account")
    public ResponseEntity<?> addUser(@ModelAttribute AccountDTO a) {
        try {
            if(a.getRole() == null || a.getRole().isBlank()){
                return ResponseEntity.badRequest().body("Vai trò không được để trống!");
            }

            Account account = new Account();
            account.setRole(Account.Role.valueOf(a.getRole()));
            account.setPasswordHash(a.getPassword());
            account.setName(a.getName());
            account.setEmail(a.getEmail());
            if(a.getAvatarUrl()!=null || !a.getAvatarUrl().isBlank())
                account.setAvatarUrl(a.getAvatarUrl());

            Account accountSaved = this.accountService.addOrUpdateAccount(account);

            return ResponseEntity.ok(accountSaved);
        } catch (Exception e) {
            e.printStackTrace(); // Log ra console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi thêm người dùng: " + e.getMessage());
        }
    }
}
