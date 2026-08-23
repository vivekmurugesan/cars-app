package com.carsapp.controller;

import com.carsapp.dto.CarDto;
import com.carsapp.service.GarageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/garage")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowedHeaders = "*")
@RequiredArgsConstructor
public class GarageController {
    private final GarageService garageService;

    @GetMapping("/{userId}")
    public ResponseEntity<Page<CarDto>> getUserGarage(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(garageService.getUserGarage(userId, page, size));
    }

    @PostMapping("/{userId}/add/{carId}")
    public ResponseEntity<?> addCarToGarage(
            @PathVariable UUID userId,
            @PathVariable UUID carId) {
        try {
            garageService.addCarToGarage(userId, carId);
            return ResponseEntity.ok(Map.of(
                "message", "Car added to garage",
                "status", "success"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/remove/{carId}")
    public ResponseEntity<?> removeCarFromGarage(
            @PathVariable UUID userId,
            @PathVariable UUID carId) {
        try {
            garageService.removeCarFromGarage(userId, carId);
            return ResponseEntity.ok(Map.of(
                "message", "Car removed from garage",
                "status", "success"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/contains/{carId}")
    public ResponseEntity<Map<String, Boolean>> isCarInGarage(
            @PathVariable UUID userId,
            @PathVariable UUID carId) {
        return ResponseEntity.ok(Map.of(
            "inGarage", garageService.isCarInGarage(userId, carId)
        ));
    }
}
