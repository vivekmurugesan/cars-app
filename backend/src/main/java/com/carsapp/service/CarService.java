package com.carsapp.service;

import com.carsapp.dto.CarDto;
import com.carsapp.entity.Car;
import com.carsapp.entity.CarFact;
import com.carsapp.entity.CarImage;
import com.carsapp.repository.CarFactRepository;
import com.carsapp.repository.CarImageRepository;
import com.carsapp.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarService {
    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;
    private final CarFactRepository carFactRepository;
    private final AIService aiService;

    public Page<CarDto> searchCars(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.searchByModelOrBrand(query, pageable)
            .map(this::convertToDto);
    }

    public Page<CarDto> getCarsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.findByCategory(category, pageable)
            .map(this::convertToDto);
    }

    public Page<CarDto> getCarsByBrand(UUID brandId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.findByBrandId(brandId, pageable)
            .map(this::convertToDto);
    }

    public Page<CarDto> getCarsByYearRange(Integer startYear, Integer endYear, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.findByYearRange(startYear, endYear, pageable)
            .map(this::convertToDto);
    }

    public Page<CarDto> getCarsByMinTopSpeed(Integer minSpeed, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.findByMinTopSpeed(minSpeed, pageable)
            .map(this::convertToDto);
    }

    public CarDto getCarDetails(UUID carId) {
        Car car = carRepository.findById(carId)
            .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        return convertToDto(car);
    }

    public Page<CarDto> getAllCars(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.findAll(pageable)
            .map(this::convertToDto);
    }

    public List<Map<String, Object>> searchCarsWithAI(String query) {
        return aiService.searchCars(query);
    }

    public Map<String, Object> getCarDetailsWithAI(String carName) {
        return aiService.getCarDetails(carName);
    }

    public CarDto convertToDto(Car car) {
        CarDto dto = new CarDto();
        dto.setId(car.getId());
        dto.setBrandName(car.getBrand().getName());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setCategory(car.getCategory());
        dto.setTopSpeed(car.getTopSpeed());
        dto.setHorsepower(car.getHorsepower());
        dto.setZeroToSixtyTime(car.getZeroToSixtyTime());
        dto.setDescription(car.getDescription());
        dto.setHistoricalSignificance(car.getHistoricalSignificance());
        dto.setFunFact(car.getFunFact());

        Optional<CarImage> primaryImage = carImageRepository.findByCarIdAndIsPrimaryTrue(car.getId());
        dto.setPrimaryImageUrl(primaryImage.map(CarImage::getImageUrl).orElse(null));

        List<CarFact> facts = carFactRepository.findByCarId(car.getId());
        dto.setFacts(facts.stream().map(CarFact::getFact).collect(Collectors.toList()));

        return dto;
    }
}
