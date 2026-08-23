package com.carsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private UUID id;
    private String title;
    private String description;
    private String difficulty;
    private String category;
    private Integer pointsReward;
    private List<QuizQuestionDto> questions;
}
