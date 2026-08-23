package com.carsapp.repository;

import com.carsapp.entity.TriviaFact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TriviaFactRepository extends JpaRepository<TriviaFact, UUID> {
    Page<TriviaFact> findByCategory(String category, Pageable pageable);

    Page<TriviaFact> findByDifficulty(String difficulty, Pageable pageable);
}
