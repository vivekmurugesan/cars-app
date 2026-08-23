package com.carsapp.controller;

import com.carsapp.dto.TriviaFactDto;
import com.carsapp.service.TriviaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/trivia")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
@RequiredArgsConstructor
public class TriviaController {
    private final TriviaService triviaService;

    @GetMapping
    public ResponseEntity<Page<TriviaFactDto>> getAllTrivia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(triviaService.getAllTrivia(page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<TriviaFactDto>> getTriviaByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(triviaService.getTriviaByCategory(category, page, size));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<Page<TriviaFactDto>> getTriviaByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(triviaService.getTriviaByDifficulty(difficulty, page, size));
    }

    @GetMapping("/{triviaId}")
    public ResponseEntity<TriviaFactDto> getTriviaDetails(@PathVariable UUID triviaId) {
        return ResponseEntity.ok(triviaService.getTriviaDetails(triviaId));
    }

    @GetMapping("/daily")
    public ResponseEntity<TriviaFactDto> getDailyTrivia() {
        try {
            return ResponseEntity.ok(triviaService.getDailyTrivia());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/daily/{triviaId}")
    public ResponseEntity<?> setDailyTrivia(@PathVariable UUID triviaId) {
        try {
            triviaService.setDailyTrivia(triviaId);
            return ResponseEntity.ok(Map.of(
                "message", "Daily trivia set successfully",
                "status", "success"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
