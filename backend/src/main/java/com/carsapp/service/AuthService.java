package com.carsapp.service;

import com.carsapp.dto.AuthResponse;
import com.carsapp.dto.UserDto;
import com.carsapp.entity.User;
import com.carsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;

    public void sendOtp(String email) {
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }

        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
    }

    public AuthResponse verifyOtp(String email, String otp) {
        if (!otpService.verifyOtp(email, otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user = existingUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setVerified(true);
            newUser.setInterests(List.of());
            return userRepository.save(newUser);
        });

        return new AuthResponse("dummy-jwt-token", mapToUserDto(user));
    }

    public AuthResponse register(String email, List<String> interests) {
        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            User user = existing.get();
            user.setInterests(interests);
            userRepository.save(user);
            return new AuthResponse("dummy-jwt-token", mapToUserDto(user));
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setVerified(true);
        newUser.setInterests(interests);
        userRepository.save(newUser);

        return new AuthResponse("dummy-jwt-token", mapToUserDto(newUser));
    }

    public UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return new UserDto(user.getEmail(), user.getInterests());
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
