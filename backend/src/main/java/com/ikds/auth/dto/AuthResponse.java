package com.ikds.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String department;
    private String title;
}
