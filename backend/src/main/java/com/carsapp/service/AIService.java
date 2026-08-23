package com.carsapp.service;

import com.carsapp.dto.TriviaFactDto;
import com.carsapp.entity.CachedTrivia;
import com.carsapp.entity.CachedQuiz;
import com.carsapp.entity.CachedCar;
import com.carsapp.entity.CachedFeaturedCar;
import com.carsapp.repository.CachedTriviaRepository;
import com.carsapp.repository.CachedQuizRepository;
import com.carsapp.repository.CachedCarRepository;
import com.carsapp.repository.CachedFeaturedCarRepository;
import com.carsapp.service.ai.GeminiAIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {
    private final GeminiAIService geminiAIService;
    private final CachedTriviaRepository cachedTriviaRepository;
    private final CachedQuizRepository cachedQuizRepository;
    private final CachedCarRepository cachedCarRepository;
    private final CachedFeaturedCarRepository cachedFeaturedCarRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> generateTrivia(String topic) {
        return cachedTriviaRepository.findByTopic(topic)
            .map(trivia -> {
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("fact", trivia.getFact());
                result.put("topic", trivia.getTopic());
                result.put("difficulty", trivia.getDifficulty());
                result.put("imageSearchTerms", trivia.getImageSearchTerms());
                result.put("videoSearchTerms", trivia.getVideoSearchTerms());
                return result;
            })
            .orElseGet(() -> {
                String fact = geminiAIService.generateTrivia(topic);
                if (fact != null) {
                    CachedTrivia cached = new CachedTrivia();
                    cached.setTopic(topic);
                    cached.setFact(fact);
                    cached.setDifficulty("medium");
                    cachedTriviaRepository.save(cached);

                    Map<String, Object> result = new java.util.HashMap<>();
                    result.put("fact", fact);
                    result.put("topic", topic);
                    result.put("difficulty", "medium");
                    return result;
                }
                return null;
            });
    }

    public Map<String, Object> generateTriviaWithMedia(String topic) {
        return cachedTriviaRepository.findByTopic(topic)
            .map(trivia -> {
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("fact", trivia.getFact());
                result.put("topic", trivia.getTopic());
                result.put("difficulty", trivia.getDifficulty());
                result.put("imageSearchTerms", trivia.getImageSearchTerms());
                result.put("videoSearchTerms", trivia.getVideoSearchTerms());
                return result;
            })
            .orElseGet(() -> {
                Map<String, Object> result = geminiAIService.generateTriviaWithMedia(topic);
                if (result != null) {
                    CachedTrivia cached = new CachedTrivia();
                    cached.setTopic(topic);
                    cached.setFact((String) result.get("fact"));
                    cached.setImageSearchTerms((String) result.get("imageSearch"));
                    cached.setVideoSearchTerms((String) result.get("videoSearch"));
                    cached.setDifficulty((String) result.get("difficulty"));
                    cachedTriviaRepository.save(cached);
                }
                return result;
            });
    }

    public Map<String, Object> generateQuizQuestion(String topic, String difficulty) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<CachedQuiz> cached = cachedQuizRepository.findByTopicAndDifficulty(topic, difficulty, pageable);

        if (!cached.isEmpty()) {
            CachedQuiz quiz = cached.getContent().get(0);
            try {
                List<String> options = objectMapper.readValue(quiz.getOptions(), List.class);
                return Map.of(
                    "question", quiz.getQuestion(),
                    "options", options,
                    "correctAnswer", quiz.getCorrectAnswer()
                );
            } catch (Exception e) {
                log.error("Failed to parse cached quiz options", e);
            }
        }

        Map<String, Object> result = geminiAIService.generateQuizQuestion(topic, difficulty);
        if (result != null) {
            CachedQuiz cached_quiz = new CachedQuiz();
            cached_quiz.setTopic(topic);
            cached_quiz.setDifficulty(difficulty);
            cached_quiz.setQuestion((String) result.get("question"));
            cached_quiz.setCorrectAnswer((String) result.get("correctAnswer"));

            try {
                List<?> options = (List<?>) result.get("options");
                cached_quiz.setOptions(objectMapper.writeValueAsString(options));
            } catch (Exception e) {
                log.error("Failed to serialize quiz options", e);
            }

            cachedQuizRepository.save(cached_quiz);
        }
        return result;
    }

    public Map<String, Object> getCarDetails(String carName) {
        return cachedCarRepository.findByCarName(carName)
            .map(car -> {
                Map<String, Object> result = new java.util.HashMap<>();
                result.put("brand", car.getBrand());
                result.put("model", car.getModel());
                result.put("year", car.getYear());
                result.put("topSpeed", car.getTopSpeed());
                result.put("horsepower", car.getHorsepower());
                result.put("description", car.getDescription());
                result.put("historicalSignificance", car.getHistoricalSignificance());
                result.put("funFact", car.getFunFact());
                return result;
            })
            .orElseGet(() -> {
                Map<String, Object> result = geminiAIService.getCarDetails(carName);
                if (result != null) {
                    CachedCar cached = new CachedCar();
                    cached.setCarName(carName);
                    cached.setBrand((String) result.get("brand"));
                    cached.setModel((String) result.get("model"));

                    Object yearObj = result.get("year");
                    if (yearObj instanceof Number) {
                        cached.setYear(((Number) yearObj).intValue());
                    }

                    Object topSpeedObj = result.get("topSpeed");
                    if (topSpeedObj instanceof Number) {
                        cached.setTopSpeed(((Number) topSpeedObj).intValue());
                    }

                    Object horsepowerObj = result.get("horsepower");
                    if (horsepowerObj instanceof Number) {
                        cached.setHorsepower(((Number) horsepowerObj).intValue());
                    }

                    cached.setDescription((String) result.get("description"));
                    cached.setHistoricalSignificance((String) result.get("historicalSignificance"));
                    cached.setFunFact((String) result.get("funFact"));

                    cachedCarRepository.save(cached);
                }
                return result;
            });
    }

    public Map<String, Object> getFeaturedCar() {
        Pageable pageable = PageRequest.of(0, 1);
        Page<CachedFeaturedCar> cached = cachedFeaturedCarRepository.findAll(pageable);

        if (!cached.isEmpty()) {
            CachedFeaturedCar featured = cached.getContent().get(0);
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("brand", featured.getBrand());
            result.put("model", featured.getModel());
            result.put("category", featured.getCategory());
            result.put("description", featured.getDescription());
            result.put("interestingFact", featured.getInterestingFact());
            result.put("whyFeatured", featured.getWhyFeatured());
            return result;
        }

        Map<String, Object> result = geminiAIService.generateFeaturedCar();
        if (result != null) {
            CachedFeaturedCar cached_featured = new CachedFeaturedCar();
            cached_featured.setBrand((String) result.get("brand"));
            cached_featured.setModel((String) result.get("model"));
            cached_featured.setCategory((String) result.get("category"));
            cached_featured.setDescription((String) result.get("description"));
            cached_featured.setInterestingFact((String) result.get("interestingFact"));
            cached_featured.setWhyFeatured((String) result.get("whyFeatured"));
            cachedFeaturedCarRepository.save(cached_featured);
        }
        return result;
    }

    public List<Map<String, Object>> searchCars(String query) {
        return geminiAIService.searchCars(query);
    }
}
