package com.carsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {
    private UUID id;
    private String brandName;
    private String model;
    private Integer year;
    private String category;
    private Integer topSpeed;
    private Integer horsepower;
    private BigDecimal zeroToSixtyTime;
    private String description;
    private String historicalSignificance;
    private String funFact;
    private String primaryImageUrl;
    private List<String> facts;
}
