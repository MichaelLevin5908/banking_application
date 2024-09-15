package com.example.banking_application.service;

import com.example.banking_application.dto.TransactionDto;

public interface TransactionService {

    void saveTransaction(TransactionDto transaction);
}
