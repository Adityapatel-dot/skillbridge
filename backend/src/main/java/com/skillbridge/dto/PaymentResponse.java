package com.skillbridge.dto;

import com.skillbridge.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long jobId;
    private Long workRequestId;
    private String jobTitle;
    private Long clientId;
    private String clientName;
    private Long workerId;
    private String workerName;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
