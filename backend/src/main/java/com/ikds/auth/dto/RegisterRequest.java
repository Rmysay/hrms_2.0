package com.ikds.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "Şifre en az 6 karakter olmalı")
    private String password;

    private String department;

    private String title;
}
