package com.carsapp.repository;

import com.carsapp.entity.UserQuizProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserQuizProgressRepository extends JpaRepository<UserQuizProgress, UUID> {
    Page<UserQuizProgress> findByUserId(UUID userId, Pageable pageable);

    Optional<UserQuizProgress> findByUserIdAndQuizId(UUID userId, UUID quizId);

    Page<UserQuizProgress> findByUserIdAndCompleted(UUID userId, Boolean completed, Pageable pageable);
}
