package com.skillbridge.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {
    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private BigDecimal budget;
    private LocalDate deadline;
    private Double latitude;
    private Double longitude;
    private String address;
    private Set<String> requiredSkills;
}