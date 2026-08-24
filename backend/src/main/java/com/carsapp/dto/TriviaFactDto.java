package com.carsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TriviaFactDto {
    private UUID id;
    private String fact;
    private String difficulty;
    private String category;
    private String imageSearchTerms;
    private String videoSearchTerms;
}
