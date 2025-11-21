package com.aws.pojo;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @Column(name = "account_uuid")
    private UUID accountUuid;

    @OneToOne
    @MapsId
    @JoinColumn(name = "account_uuid")
    private Account account;

    @Column(length = 100)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String permissions;

}