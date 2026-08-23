package com.carsapp.controller;

import com.carsapp.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
@RequiredArgsConstructor
public class AIController {
    private final AIService aiService;

    @GetMapping("/trivia")
    public ResponseEntity<Map<String, Object>> getTrivia(
            @RequestParam String topic) {
        return ResponseEntity.ok(aiService.generateTrivia(topic));
    }

    @GetMapping("/trivia-with-media")
    public ResponseEntity<Map<String, Object>> getTriviaWithMedia(
            @RequestParam String topic) {
        return ResponseEntity.ok(aiService.generateTriviaWithMedia(topic));
    }

    @GetMapping("/quiz")
    public ResponseEntity<Map<String, Object>> getQuizQuestion(
            @RequestParam String topic,
            @RequestParam(defaultValue = "medium") String difficulty) {
        return ResponseEntity.ok(aiService.generateQuizQuestion(topic, difficulty));
    }

    @GetMapping("/car-details")
    public ResponseEntity<Map<String, Object>> getCarDetails(
            @RequestParam String carName) {
        return ResponseEntity.ok(aiService.getCarDetails(carName));
    }

    @GetMapping("/featured-car")
    public ResponseEntity<Map<String, Object>> getFeaturedCar() {
        return ResponseEntity.ok(aiService.getFeaturedCar());
    }

    @GetMapping("/search-cars")
    public ResponseEntity<List<Map<String, Object>>> searchCars(
            @RequestParam String query) {
        return ResponseEntity.ok(aiService.searchCars(query));
    }
}
