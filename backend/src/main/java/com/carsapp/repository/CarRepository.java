package com.carsapp.repository;

import com.carsapp.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CarRepository extends JpaRepository<Car, UUID> {
    Page<Car> findByCategory(String category, Pageable pageable);

    Page<Car> findByBrandId(UUID brandId, Pageable pageable);

    @Query("SELECT c FROM Car c WHERE LOWER(c.model) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.brand.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Car> searchByModelOrBrand(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Car c WHERE c.year >= :startYear AND c.year <= :endYear")
    Page<Car> findByYearRange(@Param("startYear") Integer startYear, @Param("endYear") Integer endYear, Pageable pageable);

    @Query("SELECT c FROM Car c WHERE c.topSpeed >= :minSpeed ORDER BY c.topSpeed DESC")
    Page<Car> findByMinTopSpeed(@Param("minSpeed") Integer minSpeed, Pageable pageable);

    List<Car> findByBrandId(UUID brandId);
}
