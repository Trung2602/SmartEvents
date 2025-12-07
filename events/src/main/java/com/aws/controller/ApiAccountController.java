package com.aws.controller;


import com.aws.dto.AccountDTO;
import com.aws.pojo.Account;
import com.aws.services.AccountService;
import com.aws.services.MailService;
import com.aws.services.OTPService;
import com.aws.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiAccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private MailService mailService;

    @Autowired
    private OTPService otpService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AccountDTO dto) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Username or password cannot be null");
        }

        Account account = accountService.getAccountByEmail(dto.getEmail());
        if (account == null) {
            // account không tồn tại
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        if (!account.getEmailVerified()) {
            // gửi OTP nếu email chưa verify
            String otp = String.valueOf(new Random().nextInt(900000) + 100000);
            otpService.saveOtp(dto.getEmail(), otp);
            mailService.sendMail(
                    dto.getEmail(),
                    "Mã OTP xác thực",
                    "Mã OTP của bạn là: " + otp + "\nMã này sẽ hết hạn sau 5 phút."
            );
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Email not verified. OTP has been sent.");
        }

        boolean authOK = accountService.authenticate(dto.getEmail(), dto.getPassword());
        if (!authOK) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token;
        try {
            token = JwtUtils.generateToken(dto.getEmail());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not create JWT");
        }

        // cập nhật last login time sau khi authenticate thành công
        account.setLastLoginAt(LocalDateTime.now());
        accountService.addOrUpdateAccount(account);

        Map<String, String> result = Collections.singletonMap("token", token);
        return ResponseEntity.ok(result);
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<Account> getProfile(Principal principal) {
        return new ResponseEntity<>(this.accountService.getAccountByEmail(principal.getName()), HttpStatus.OK);
    }


    @PostMapping("/register/account")
    public ResponseEntity<?> userRegisterAccount(@RequestBody AccountDTO a) {
        try {
            Account account = new Account();
            account.setRole(Account.Role.USER);
            account.setPasswordHash(a.getPassword());
            account.setEmail(a.getEmail());

            Account accountSaved = this.accountService.addOrUpdateAccount(account);

            String otp = String.valueOf(new Random().nextInt(900000) + 100000);
            otpService.saveOtp(a.getEmail(), otp);
            mailService.sendMail(a.getEmail(),"Mã OTP xác thực", "Mã OTP của bạn là: " + otp + "\nMã này sẽ hết hạn sau 5 phút.");

            return ResponseEntity.ok(accountSaved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error to create new User: " + e.getMessage());
        }
    }


    @PostMapping("/user/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String otp) {
        String cachedOtp = otpService.getOtp(email);

        if (cachedOtp == null) {
            return ResponseEntity.status(404).body("OTP đã hết hạn");
        }

        if (!cachedOtp.equals(otp)) {
            return ResponseEntity.status(400).body("OTP không chính xác");
        }
        Account account = this.accountService.getAccountByEmail(email);
        account.setEmailVerified(Boolean.TRUE);
        this.accountService.addOrUpdateAccount(account);

        String resetToken = UUID.randomUUID().toString();
        otpService.saveResetToken(email, resetToken);

        return ResponseEntity.ok(Map.of(
                "message", "Xác minh OTP thành công",
                "resetToken", resetToken
        ));
    }
}
