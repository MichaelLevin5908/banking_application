package com.example.banking_application.repository;

import com.example.banking_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByEmail(String Email);

    Optional<User> findByEmail(String Email);

    Boolean existsByAccountNumber(String AccountNumber);

    User findByAccountNumber(String accountNumber);

}
