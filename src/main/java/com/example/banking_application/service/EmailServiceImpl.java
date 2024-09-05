package com.example.banking_application.service;

import com.example.banking_application.dto.EmailDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendEmail(EmailDetails emailDetails) {
        try{
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(senderEmail);
            mailMessage.setTo(emailDetails.getRecipient());
            mailMessage.setText(emailDetails.getBody());
            mailMessage.setSubject(emailDetails.getSubject());

            mailSender.send(mailMessage);
            System.out.println("Email sent successfully");
        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}
