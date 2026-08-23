package com.carsapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
public class AuthController {

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email is required"));
        }

        // TODO: Implement OTP generation and email sending
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to " + email);
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email and OTP are required"));
        }

        // TODO: Implement OTP verification and user authentication
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-jwt-token");
        response.put("user", Map.of("email", email, "interests", new String[]{}));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        String email = request.get("email").toString();
        Object interests = request.get("interests");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email is required"));
        }

        // TODO: Implement user registration
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-jwt-token");
        response.put("user", Map.of("email", email, "interests", interests));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // TODO: Get user profile from token
        Map<String, Object> response = new HashMap<>();
        response.put("email", "user@example.com");
        response.put("interests", new String[]{});

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
