package com.carsapp.repository;

import com.carsapp.entity.CachedCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CachedCarRepository extends JpaRepository<CachedCar, UUID> {
    Optional<CachedCar> findByCarName(String carName);
}
