package com.example.banking_application.service;

import com.example.banking_application.config.JwtTokenProvider;
import com.example.banking_application.dto.*;
import com.example.banking_application.entity.User;
import com.example.banking_application.repository.Role;
import com.example.banking_application.repository.UserRepository;
import com.example.banking_application.utils.AccountUtils;
import lombok.AllArgsConstructor;
import org.springdoc.core.service.RequestBodyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RequestBodyService requestBodyBuilder;

    public UserServiceImpl() {}

    @Override
    public BankResponse createAccount(UserRequest userRequest){
    if(userRepository.existsByEmail(userRequest.getEmail())){
        return  BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_EXISTS_CODE)
                .responseMessage(AccountUtils.ACCOUNT_EXISTS_MESSAGE)
                .accountInfo(null)
                .build();
    }
            User newUser = User.builder()
                 .firstName(userRequest.getFirstName())
                 .lastName(userRequest.getLastName())
                 .gender(userRequest.getGender())
                 .address(userRequest.getAddress())
                 .stateOfOrigin(userRequest.getStateOfOrigin())
                 .accountNumber(AccountUtils.generateAccountNumber())
                 .email(userRequest.getEmail())
                 .password(passwordEncoder.encode(userRequest.getPassword()))
                 .accountBalance(BigDecimal.ZERO)
                 .phoneNumber(userRequest.getPhoneNumber())
                 .alternatePhoneNumber(userRequest.getAlternatePhoneNumber())
                 .status("ACTIVE")
                 .role(Role.valueOf("ROLE_ADMIN"))
                 .build();
    User savedUser = userRepository.save(newUser);
    EmailDetails emailDetails = EmailDetails.builder()
            .recipient(savedUser.getEmail())
            .subject("ACCOUNT CREATION")
            .body("Your account has been created\nYour Account Details:\nAccount Name:" + "\nAccount number: "+ savedUser.getAccountNumber())
            .build();

    emailService.sendEmail(emailDetails);
    return BankResponse.builder()
            .responseCode(AccountUtils.ACCOUNT_CREATION_SUCCESS)
            .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
            .accountInfo(AccountInfo.builder()
                    .accountBalance(savedUser.getAccountBalance())
                    .accountNumber(savedUser.getAccountNumber())
                    .accountName(savedUser.getFirstName() + " " + savedUser.getLastName() + " " + savedUser.getOtherName())
                    .build())
            .build();

    }

    @Override
    public BankResponse login(loginDto loginDto) {
        // Authenticate the user using AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        // Send login email alert
        EmailDetails loginAlert = EmailDetails.builder()
                .subject("You are logged in")
                .recipient(loginDto.getEmail())
                .body("You have logged into your account. If you did not initiate this request, please secure your account.")
                .build();
        emailService.sendEmail(loginAlert);

        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Return response with JWT token
        return BankResponse.builder()
                .responseCode("200")  // Use HTTP 200-like code for successful login
                .responseMessage("Login Success")
                .token(jwtTokenProvider.generateToken(authentication))
                .accountInfo(AccountInfo.builder()
                        .accountBalance(user.getAccountBalance())
                        .accountNumber(user.getAccountNumber())
                        .accountName(user.getFirstName() + " " + user.getLastName() + " " + user.getOtherName())
                        .build())
                .build();
    }

    @Override
    public BankResponse balanceEnquiry(EnquiryRequest request) {
        //check if the provided account number exists in the db
        boolean isAccountExist = userRepository.existsByAccountNumber(request.getAccountNumber());
        if (!isAccountExist) {
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXIST_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        User foundUser = userRepository.findByAccountNumber(request.getAccountNumber());
        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_FOUND_CODE)
                .responseMessage(AccountUtils.ACCOUNT_FOUND_SUCCESS)
                .accountInfo(AccountInfo.builder()
                        .accountBalance(foundUser.getAccountBalance())
                        .accountNumber(request.getAccountNumber())
                        .accountName(foundUser.getFirstName() + " " + foundUser.getLastName() + " " + foundUser.getOtherName())
                        .build())
                .build();
    }
    @Override
    public String nameEnquiry(EnquiryRequest request) {
        boolean isAccountExist = userRepository.existsByAccountNumber(request.getAccountNumber());
        if (!isAccountExist){
            return AccountUtils.ACCOUNT_NOT_EXIST_MESSAGE;
        }
        User foundUser = userRepository.findByAccountNumber(request.getAccountNumber());
        return foundUser.getFirstName() + " " + foundUser.getLastName() + " " + foundUser.getOtherName();
    }

    @Override
    public BankResponse creditAccount(CreditDebitRequest request) {
        //checking if the account exists
        boolean isAccountExist = userRepository.existsByAccountNumber(request.getAccountNumber());
        if (!isAccountExist){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXIST_MESSAGE)
                    .accountInfo(null)
                    .build();
        }

        User userToCredit = userRepository.findByAccountNumber(request.getAccountNumber());
        userToCredit.setAccountBalance(userToCredit.getAccountBalance().add(request.getAmount()));
        userRepository.save(userToCredit);
        TransactionDto transactionDto = TransactionDto.builder()
                .accountNumber(userToCredit.getAccountNumber())
                .transactionType("CREDIT")
                .amount(request.getAmount())
                .build();
        transactionService.saveTransaction(transactionDto);

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREDITED_SUCCESS)
                .responseMessage(AccountUtils.ACCOUNT_CREDITED_SUCCESS_MESSAGE)
                .accountInfo(AccountInfo.builder()
                        .accountName(userToCredit.getFirstName() + " " + userToCredit.getLastName() + " " + userToCredit.getOtherName())
                        .accountBalance(userToCredit.getAccountBalance())
                        .accountNumber(request.getAccountNumber())
                        .build())
                .build();
    }

    @Override
    public BankResponse debitAccount(CreditDebitRequest request) {
        //check if the account exists
        //check if the amount you intend to withdraw is not more than the current account balance
        boolean isAccountExist = userRepository.existsByAccountNumber(request.getAccountNumber());
        if (!isAccountExist){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXIST_MESSAGE)
                    .accountInfo(null)
                    .build();
        }

        User userToDebit = userRepository.findByAccountNumber(request.getAccountNumber());
        BigInteger availableBalance =userToDebit.getAccountBalance().toBigInteger();
        BigInteger debitAmount = request.getAmount().toBigInteger();
        if ( availableBalance.intValue() < debitAmount.intValue()){
            return BankResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        else {
            userToDebit.setAccountBalance(userToDebit.getAccountBalance().subtract(request.getAmount()));
            TransactionDto transactionDto = TransactionDto.builder()
                    .accountNumber(userToDebit.getAccountNumber())
                    .transactionType("DEBIT")
                    .amount(request.getAmount())
                    .build();
            transactionService.saveTransaction(transactionDto);
            userRepository.save(userToDebit);
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DEBITED_SUCCESS)
                    .responseMessage(AccountUtils.ACCOUNT_DEBITED_MESSAGE)
                    .accountInfo(AccountInfo.builder()
                            .accountNumber(request.getAccountNumber())
                            .accountName(userToDebit.getFirstName() + " " + userToDebit.getLastName() + " " + userToDebit.getOtherName())
                            .accountBalance(userToDebit.getAccountBalance())
                            .build())
                    .build();
        }

    }

    @Override
    public BankResponse transfer(TransferRequest request) {
        boolean isDestinationAccountExist = userRepository.existsByAccountNumber(request.getDestinationAccountNumber());
        if (!isDestinationAccountExist) {
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXIST_MESSAGE)
                    .accountInfo(null)
                    .build();
        }

        User sourceAccount = userRepository.findByAccountNumber(request.getSourceAccountNumber());
        if (request.getAmount().compareTo(sourceAccount.getAccountBalance()) < 0) {
            return BankResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .accountInfo(null)
                    .build();
        }

        // Construct source username
        String sourceUsername = sourceAccount.getFirstName() + " " + sourceAccount.getLastName()
                + (sourceAccount.getOtherName() != null ? " " + sourceAccount.getOtherName() : "");

        // Update source account balance
        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance().subtract(request.getAmount()));
        userRepository.save(sourceAccount);

        // Log transaction for source account (DEBIT)
        TransactionDto transactionDto = TransactionDto.builder()
                .accountNumber(sourceAccount.getAccountNumber())
                .transactionType("DEBIT")
                .amount(request.getAmount())
                .build();
        transactionService.saveTransaction(transactionDto);

        // Send debit alert email
        EmailDetails debitAlert = EmailDetails.builder()
                .subject("DEBIT ALERT")
                .recipient(sourceAccount.getEmail())
                .body("Dear " + sourceUsername + ",\n\nThe sum of " + request.getAmount() +
                        " has been deducted from your account. Your new balance is " + sourceAccount.getAccountBalance() + ".")
                .build();
        emailService.sendEmail(debitAlert);

        // Update destination account balance
        User destinationAccount = userRepository.findByAccountNumber(request.getDestinationAccountNumber());
        destinationAccount.setAccountBalance(destinationAccount.getAccountBalance().add(request.getAmount()));
        userRepository.save(destinationAccount);

        // Log transaction for destination account (CREDIT)
        TransactionDto creditTransactionDto = TransactionDto.builder()
                .accountNumber(destinationAccount.getAccountNumber())
                .transactionType("CREDIT")
                .amount(request.getAmount())
                .build();
        transactionService.saveTransaction(creditTransactionDto);

        // Send credit alert email
        EmailDetails creditAlert = EmailDetails.builder()
                .subject("CREDIT ALERT")
                .recipient(destinationAccount.getEmail())
                .body("Dear " + sourceUsername + ",\n\nThe sum of " + request.getAmount() +
                        " has been added to your account. Your new balance is " + destinationAccount.getAccountBalance() + ".")
                .build();
        emailService.sendEmail(creditAlert);

        return BankResponse.builder()
                .responseCode(AccountUtils.TRANSFER_SUCCESSFUL_CODE)
                .responseMessage(AccountUtils.TRANSFER_SUCCESSFUL_MESSAGE)
                .accountInfo(null)
                .build();
    }
    public static void main(String[] args) {
        UserServiceImpl userService = new UserServiceImpl();
        System.out.println(userService.passwordEncoder.encode("1234"));
    }
}
