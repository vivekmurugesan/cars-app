package com.carsapp.repository;

import com.carsapp.entity.CachedQuiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CachedQuizRepository extends JpaRepository<CachedQuiz, UUID> {
    Page<CachedQuiz> findByTopic(String topic, Pageable pageable);
    Page<CachedQuiz> findByDifficulty(String difficulty, Pageable pageable);
    Page<CachedQuiz> findByTopicAndDifficulty(String topic, String difficulty, Pageable pageable);
}
