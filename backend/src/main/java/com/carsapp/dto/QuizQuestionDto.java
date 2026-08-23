package com.carsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {
    private UUID id;
    private String question;
    private Integer questionOrder;
    private List<QuizOptionDto> options;
}
