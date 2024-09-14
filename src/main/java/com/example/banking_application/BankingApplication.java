package com.example.banking_application;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Bank_application",
                description = "Backend Rest APIs for bank",
                version = "v1.0",
                contact = @Contact(
                        name = "Michael Levin",
                        email = "michaeljusitnlevin@gmail.com",
                        url = "https://github.com/MichaelLevin5908/banking_application"
                ),
                license = @License(
                        name = "Michael Levin",
                        url = "https://github.com/MichaelLevin5908/banking_application"
                )
        ),
        externalDocs = @ExternalDocumentation(
                description= "Java banking app Documentation",
                url = "https://github.com/MichaelLevin5908/banking_application"
        )
)
public class BankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingApplication.class, args);
    }

}
