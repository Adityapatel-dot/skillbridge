package com.skillbridge.dto;

import com.skillbridge.enums.ApplicationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long workerId;
    private String workerName;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
}