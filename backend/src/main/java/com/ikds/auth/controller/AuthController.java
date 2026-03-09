package com.ikds.auth.controller;

import com.ikds.auth.dto.AuthResponse;
import com.ikds.auth.dto.LoginRequest;
import com.ikds.auth.dto.RegisterRequest;
import com.ikds.auth.entity.Role;
import com.ikds.auth.entity.User;
import com.ikds.auth.repository.UserRepository;
import com.ikds.auth.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);

            return ResponseEntity.ok(buildAuthResponse(user, token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Geçersiz e-posta veya şifre"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Bu e-posta adresi zaten kayıtlı"));
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE)
                .department(request.getDepartment())
                .title(request.getTitle())
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(buildAuthResponse(user, token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Oturum açmanız gerekiyor"));
        }
        return ResponseEntity.ok(buildAuthResponse(user, null));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName(),
                "email", u.getEmail(),
                "department", u.getDepartment() != null ? u.getDepartment() : "",
                "title", u.getTitle() != null ? u.getTitle() : "",
                "roles", List.of(u.getRole().name())
        )).toList();
        return ResponseEntity.ok(users);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .title(user.getTitle())
                .build();
    }
}
