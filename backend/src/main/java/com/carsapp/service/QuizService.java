package com.carsapp.service;

import com.carsapp.dto.QuizDto;
import com.carsapp.dto.QuizOptionDto;
import com.carsapp.dto.QuizQuestionDto;
import com.carsapp.entity.Quiz;
import com.carsapp.entity.QuizOption;
import com.carsapp.entity.QuizQuestion;
import com.carsapp.entity.UserQuizProgress;
import com.carsapp.repository.QuizRepository;
import com.carsapp.repository.UserQuizProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;
    private final UserQuizProgressRepository userQuizProgressRepository;

    public Page<QuizDto> getAllQuizzes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return quizRepository.findAll(pageable).map(this::convertToDto);
    }

    public Page<QuizDto> getQuizzesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return quizRepository.findByCategory(category, pageable).map(this::convertToDto);
    }

    public Page<QuizDto> getQuizzesByDifficulty(String difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return quizRepository.findByDifficulty(difficulty, pageable).map(this::convertToDto);
    }

    public QuizDto getQuizDetails(UUID quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        return convertToDto(quiz);
    }

    public void submitQuizAnswers(UUID userId, UUID quizId, List<UUID> selectedOptions) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        int score = 0;
        for (QuizQuestion question : quiz.getQuestions()) {
            for (QuizOption option : question.getOptions()) {
                if (selectedOptions.contains(option.getId()) && option.getIsCorrect()) {
                    score++;
                }
            }
        }

        Optional<UserQuizProgress> existing = userQuizProgressRepository.findByUserIdAndQuizId(userId, quizId);

        UserQuizProgress progress;
        if (existing.isPresent()) {
            progress = existing.get();
            progress.setScore(Math.max(progress.getScore(), score));
        } else {
            progress = new UserQuizProgress();
            progress.setScore(score);
        }

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        userQuizProgressRepository.save(progress);
    }

    public Page<QuizDto> getUserQuizProgress(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserQuizProgress> progressPage = userQuizProgressRepository.findByUserId(userId, pageable);
        return progressPage.map(progress -> convertToDto(progress.getQuiz()));
    }

    private QuizDto convertToDto(Quiz quiz) {
        QuizDto dto = new QuizDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setCategory(quiz.getCategory());
        dto.setPointsReward(quiz.getPointsReward());

        if (quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                .map(this::convertQuestionToDto)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    private QuizQuestionDto convertQuestionToDto(QuizQuestion question) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setQuestionOrder(question.getQuestionOrder());

        if (question.getOptions() != null) {
            dto.setOptions(question.getOptions().stream()
                .map(this::convertOptionToDto)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    private QuizOptionDto convertOptionToDto(QuizOption option) {
        QuizOptionDto dto = new QuizOptionDto();
        dto.setId(option.getId());
        dto.setOptionText(option.getOptionText());
        dto.setOptionOrder(option.getOptionOrder());
        dto.setIsCorrect(null);
        return dto;
    }
}
