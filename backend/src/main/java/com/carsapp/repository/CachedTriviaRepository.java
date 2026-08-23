package com.carsapp.repository;

import com.carsapp.entity.CachedTrivia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CachedTriviaRepository extends JpaRepository<CachedTrivia, UUID> {
    Optional<CachedTrivia> findByTopic(String topic);
    Page<CachedTrivia> findByDifficulty(String difficulty, Pageable pageable);
}
