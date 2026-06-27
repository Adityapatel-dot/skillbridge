package com.skillbridge.dto;

import com.skillbridge.enums.JobStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private JobStatus status;
    private String clientName;
    private Long clientId;
    private String assignedWorkerName;
    private Long assignedWorkerId;
    private Set<String> requiredSkills;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private Double latitude;
    private Double longitude;
    private String address;
}