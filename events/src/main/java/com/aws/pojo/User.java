package com.aws.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;


@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "account_uuid")
    private UUID accountUuid;

    @OneToOne
    @MapsId
    @JoinColumn(name = "account_uuid")
    private Account account;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 100)
    private String city;

    @Column(name = "country_code", length = 10)
    private String countryCode;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "sentiment_score")
    private BigDecimal sentimentScore = BigDecimal.valueOf(0.000);

    @Column(columnDefinition = "TEXT")
    private String preferences;

}
