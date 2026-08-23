package com.carsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizOptionDto {
    private UUID id;
    private String optionText;
    private Integer optionOrder;
    private Boolean isCorrect;
}
