package com.example.banking_application.service;

import com.example.banking_application.dto.TransactionDto;
import com.example.banking_application.entity.Transaction;
import com.example.banking_application.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransacationImpl implements TransactionService{

    @Autowired
    TransactionRepository transactionRepository;

    @Override
    public void saveTransaction(TransactionDto transactionDto) {
        Transaction transaction = Transaction.builder()
                .transactionType(transactionDto.getTransactionType())
                .accountNumber(transactionDto.getAccountNumber())
                .amount(transactionDto.getAmount())
                .status("SUCCESS")
                .build();
        transactionRepository.save(transaction);
        System.out.println(transaction);
    }
}
