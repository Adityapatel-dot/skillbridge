package com.skillbridge.dto;

import com.skillbridge.enums.RequestStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkRequestDTO {
    private Long id;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @NotBlank(message = "Description is required")
    private String description;

    private BigDecimal budget;
    private Long clientId;
    private String clientName;
    private Long workerId;
    private String workerName;
    private Double latitude;
    private Double longitude;
    private String address;
    private RequestStatus status;
    private LocalDateTime createdAt;
}