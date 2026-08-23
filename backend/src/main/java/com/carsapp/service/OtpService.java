package com.carsapp.service;

import com.carsapp.entity.Otp;
import com.carsapp.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final OtpRepository otpRepository;

    @Value("${app.otp.validity-minutes:5}")
    private int otpValidityMinutes;

    @Value("${app.otp.length:6}")
    private int otpLength;

    public String generateOtp(String email) {
        String otpCode = generateRandomOtp();

        otpRepository.findByEmailAndVerifiedFalse(email).ifPresent(otpRepository::delete);

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setVerified(false);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(otpValidityMinutes));

        otpRepository.save(otp);
        return otpCode;
    }

    public boolean verifyOtp(String email, String code) {
        Optional<Otp> otpOptional = otpRepository.findByEmailAndCodeAndVerifiedFalse(email, code);

        if (otpOptional.isEmpty()) {
            return false;
        }

        Otp otp = otpOptional.get();
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        otp.setVerified(true);
        otpRepository.save(otp);
        return true;
    }

    private String generateRandomOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
