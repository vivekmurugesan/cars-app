package com.carsapp.repository;

import com.carsapp.entity.CarFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CarFactRepository extends JpaRepository<CarFact, UUID> {
    List<CarFact> findByCarId(UUID carId);
}
