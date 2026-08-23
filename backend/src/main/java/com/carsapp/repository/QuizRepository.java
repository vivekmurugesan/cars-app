package com.carsapp.repository;

import com.carsapp.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    Page<Quiz> findByCategory(String category, Pageable pageable);

    Page<Quiz> findByDifficulty(String difficulty, Pageable pageable);
}
