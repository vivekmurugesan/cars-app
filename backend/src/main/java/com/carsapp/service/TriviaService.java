package com.carsapp.service;

import com.carsapp.dto.TriviaFactDto;
import com.carsapp.entity.DailyTrivia;
import com.carsapp.entity.TriviaFact;
import com.carsapp.repository.DailyTriviaRepository;
import com.carsapp.repository.TriviaFactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TriviaService {
    private final TriviaFactRepository triviaFactRepository;
    private final DailyTriviaRepository dailyTriviaRepository;

    public Page<TriviaFactDto> getAllTrivia(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return triviaFactRepository.findAll(pageable).map(this::convertToDto);
    }

    public Page<TriviaFactDto> getTriviaByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return triviaFactRepository.findByCategory(category, pageable).map(this::convertToDto);
    }

    public Page<TriviaFactDto> getTriviaByDifficulty(String difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return triviaFactRepository.findByDifficulty(difficulty, pageable).map(this::convertToDto);
    }

    public TriviaFactDto getTriviaDetails(UUID triviaId) {
        TriviaFact trivia = triviaFactRepository.findById(triviaId)
            .orElseThrow(() -> new IllegalArgumentException("Trivia not found"));
        return convertToDto(trivia);
    }

    public TriviaFactDto getDailyTrivia() {
        LocalDate today = LocalDate.now();

        // Try to get the daily trivia for today
        var existingDaily = dailyTriviaRepository.findByTriviaDate(today);
        if (existingDaily.isPresent()) {
            return convertToDto(existingDaily.get().getTrivia());
        }

        // If no daily trivia is set, return a random trivia
        List<TriviaFact> allTrivia = triviaFactRepository.findAll();
        if (allTrivia.isEmpty()) {
            throw new IllegalArgumentException("No trivia facts available");
        }

        TriviaFact randomTrivia = allTrivia.get(new Random().nextInt(allTrivia.size()));
        return convertToDto(randomTrivia);
    }

    public void setDailyTrivia(UUID triviaId) {
        TriviaFact trivia = triviaFactRepository.findById(triviaId)
            .orElseThrow(() -> new IllegalArgumentException("Trivia not found"));

        LocalDate today = LocalDate.now();
        DailyTrivia existing = dailyTriviaRepository.findByTriviaDate(today).orElse(null);

        if (existing == null) {
            DailyTrivia dailyTrivia = new DailyTrivia();
            dailyTrivia.setTrivia(trivia);
            dailyTrivia.setTriviaDate(today);
            dailyTriviaRepository.save(dailyTrivia);
        }
    }

    private TriviaFactDto convertToDto(TriviaFact trivia) {
        return new TriviaFactDto(
            trivia.getId(),
            trivia.getFact(),
            trivia.getDifficulty(),
            trivia.getCategory()
        );
    }
}
