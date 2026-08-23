package com.carsapp.service;

import com.carsapp.dto.CarDto;
import com.carsapp.entity.Car;
import com.carsapp.entity.User;
import com.carsapp.entity.UserGarage;
import com.carsapp.repository.CarRepository;
import com.carsapp.repository.UserGarageRepository;
import com.carsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GarageService {
    private final UserGarageRepository userGarageRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final CarService carService;

    public void addCarToGarage(UUID userId, UUID carId) {
        if (userGarageRepository.existsByUserIdAndCarId(userId, carId)) {
            throw new IllegalArgumentException("Car already in garage");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Car car = carRepository.findById(carId)
            .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        UserGarage userGarage = new UserGarage();
        userGarage.setUser(user);
        userGarage.setCar(car);

        userGarageRepository.save(userGarage);
    }

    public void removeCarFromGarage(UUID userId, UUID carId) {
        UserGarage userGarage = userGarageRepository.findByUserIdAndCarId(userId, carId)
            .orElseThrow(() -> new IllegalArgumentException("Car not in garage"));

        userGarageRepository.delete(userGarage);
    }

    public Page<CarDto> getUserGarage(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserGarage> userGarages = userGarageRepository.findByUserId(userId, pageable);

        return userGarages.map(ug -> carService.convertToDto(ug.getCar()));
    }

    public boolean isCarInGarage(UUID userId, UUID carId) {
        return userGarageRepository.existsByUserIdAndCarId(userId, carId);
    }
}
