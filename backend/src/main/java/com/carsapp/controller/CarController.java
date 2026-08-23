package com.carsapp.controller;

import com.carsapp.dto.CarDto;
import com.carsapp.service.CarService;
import com.carsapp.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;
    private final AIService aiService;

    @GetMapping
    public ResponseEntity<Page<CarDto>> getAllCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.getAllCars(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CarDto>> searchCars(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.searchCars(query, page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<CarDto>> getCarsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.getCarsByCategory(category, page, size));
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<Page<CarDto>> getCarsByBrand(
            @PathVariable UUID brandId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.getCarsByBrand(brandId, page, size));
    }

    @GetMapping("/year-range")
    public ResponseEntity<Page<CarDto>> getCarsByYearRange(
            @RequestParam Integer startYear,
            @RequestParam Integer endYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.getCarsByYearRange(startYear, endYear, page, size));
    }

    @GetMapping("/min-speed")
    public ResponseEntity<Page<CarDto>> getCarsByMinTopSpeed(
            @RequestParam Integer minSpeed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(carService.getCarsByMinTopSpeed(minSpeed, page, size));
    }

    @GetMapping("/{carId}")
    public ResponseEntity<CarDto> getCarDetails(@PathVariable UUID carId) {
        return ResponseEntity.ok(carService.getCarDetails(carId));
    }

    @GetMapping("/featured/car")
    public ResponseEntity<Map<String, Object>> getFeaturedCar() {
        return ResponseEntity.ok(aiService.getFeaturedCar());
    }

    @GetMapping("/ai/search")
    public ResponseEntity<?> searchCarsWithAI(@RequestParam String query) {
        return ResponseEntity.ok(aiService.searchCars(query));
    }

    @GetMapping("/ai/details")
    public ResponseEntity<Map<String, Object>> getCarDetailsWithAI(@RequestParam String carName) {
        return ResponseEntity.ok(aiService.getCarDetails(carName));
    }
}
