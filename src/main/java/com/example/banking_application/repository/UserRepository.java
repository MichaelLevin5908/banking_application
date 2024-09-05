package com.example.banking_application.repository;

import com.example.banking_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByEmail(String Email);

    Boolean existsByAccountNumber(String AccountNumber);

    User findByAccountNumber(String accountNumber);
}
