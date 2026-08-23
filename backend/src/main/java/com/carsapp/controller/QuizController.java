package com.carsapp.controller;

import com.carsapp.dto.QuizDto;
import com.carsapp.service.QuizService;
import com.carsapp.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;
    private final AIService aiService;

    @GetMapping
    public ResponseEntity<Page<QuizDto>> getAllQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quizService.getAllQuizzes(page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<QuizDto>> getQuizzesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quizService.getQuizzesByCategory(category, page, size));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<Page<QuizDto>> getQuizzesByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quizService.getQuizzesByDifficulty(difficulty, page, size));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDto> getQuizDetails(@PathVariable UUID quizId) {
        return ResponseEntity.ok(quizService.getQuizDetails(quizId));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(
            @PathVariable UUID quizId,
            @RequestParam UUID userId,
            @RequestBody Map<String, List<UUID>> request) {
        try {
            List<UUID> selectedOptions = request.get("selectedOptions");
            quizService.submitQuizAnswers(userId, quizId, selectedOptions);
            return ResponseEntity.ok(Map.of(
                "message", "Quiz submitted successfully",
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<QuizDto>> getUserQuizProgress(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quizService.getUserQuizProgress(userId, page, size));
    }

    @GetMapping("/ai/generate")
    public ResponseEntity<Map<String, Object>> generateQuizWithAI(
            @RequestParam String topic,
            @RequestParam(defaultValue = "medium") String difficulty) {
        return ResponseEntity.ok(aiService.generateQuizQuestion(topic, difficulty));
    }
}
