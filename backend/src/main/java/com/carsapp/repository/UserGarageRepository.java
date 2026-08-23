package com.carsapp.repository;

import com.carsapp.entity.UserGarage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserGarageRepository extends JpaRepository<UserGarage, UUID> {
    Page<UserGarage> findByUserId(UUID userId, Pageable pageable);

    Optional<UserGarage> findByUserIdAndCarId(UUID userId, UUID carId);

    boolean existsByUserIdAndCarId(UUID userId, UUID carId);
}
