package com.example.banking_application.repository;

import com.example.banking_application.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRespository extends JpaRepository<Transaction, String>{

}
