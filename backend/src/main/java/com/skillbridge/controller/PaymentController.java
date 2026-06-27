package com.skillbridge.controller;

import com.skillbridge.dto.PaymentRequest;
import com.skillbridge.dto.PaymentResponse;
import com.skillbridge.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        return ResponseEntity.ok(paymentService.getMyPayments());
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<PaymentResponse> getPaymentByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(paymentService.getPaymentByJob(jobId));
    }

    @GetMapping("/work-request/{workRequestId}")
    public ResponseEntity<PaymentResponse> getPaymentByWorkRequest(@PathVariable Long workRequestId) {
        return ResponseEntity.ok(paymentService.getPaymentByWorkRequest(workRequestId));
    }
}
