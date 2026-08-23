package com.carsapp.repository;

import com.carsapp.entity.CachedFeaturedCar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CachedFeaturedCarRepository extends JpaRepository<CachedFeaturedCar, UUID> {
    Page<CachedFeaturedCar> findAll(Pageable pageable);
}
