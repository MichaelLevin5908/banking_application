package com.example.banking_application.controller;


import com.example.banking_application.dto.BankResponse;
import com.example.banking_application.dto.UserRequest;
import com.example.banking_application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")

public class UserController {

    @Autowired
    UserService userService;

    public BankResponse createAccount(@RequestBody UserRequest userRequest) {
        return userService.createAccount(userRequest);
    }
}
