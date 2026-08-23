package com.carsapp.repository;

import com.carsapp.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<Otp, UUID> {
    Optional<Otp> findByEmailAndCodeAndVerifiedFalse(String email, String code);
    Optional<Otp> findByEmailAndVerifiedFalse(String email);
}
