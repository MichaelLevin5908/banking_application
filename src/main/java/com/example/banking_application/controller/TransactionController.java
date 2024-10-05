package com.example.banking_application.controller;


import com.example.banking_application.entity.Transaction;
import com.example.banking_application.service.bankStatement;
import com.itextpdf.text.DocumentException;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class TransactionController {

    private bankStatement bankstatement;

    @GetMapping("/bankStatement")
    public List<Transaction> generateBankStatement(@RequestParam String accountNumber, @RequestParam String startDate, @RequestParam String endDate) throws DocumentException, FileNotFoundException {
        return bankstatement.generateStatement(accountNumber, startDate, endDate);
    }
}
