package com.example.banking_application.service;

import com.example.banking_application.dto.EmailDetails;

public interface EmailService {
    void sendEmail(EmailDetails emailDetails);
}
