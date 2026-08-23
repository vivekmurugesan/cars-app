package com.carsapp.repository;

import com.carsapp.entity.DailyTrivia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyTriviaRepository extends JpaRepository<DailyTrivia, UUID> {
    Optional<DailyTrivia> findByTriviaDate(LocalDate date);
}
