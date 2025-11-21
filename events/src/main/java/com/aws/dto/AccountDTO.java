package com.aws.dto;


import lombok.Data;

@Data
public class AccountDTO {
    private String email;
    private String name;
    private String password;
    private String avatarUrl;
    private String role;
}
