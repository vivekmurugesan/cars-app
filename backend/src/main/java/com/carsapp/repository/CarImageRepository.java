package com.carsapp.repository;

import com.carsapp.entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, UUID> {
    List<CarImage> findByCarId(UUID carId);

    Optional<CarImage> findByCarIdAndIsPrimaryTrue(UUID carId);
}
