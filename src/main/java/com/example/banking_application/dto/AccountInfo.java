package com.example.banking_application.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AccountInfo {
    private String accountName;

    private BigDecimal accountBalance;

    private String accountNumber;

}