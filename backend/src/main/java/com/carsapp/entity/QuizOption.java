package com.carsapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "quiz_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizOption {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Column(name = "option_text", nullable = false)
    private String optionText;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "option_order")
    private Integer optionOrder;
}
