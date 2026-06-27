package com.skillbridge.repository;

import com.skillbridge.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByClientId(Long clientId);
    List<Payment> findByWorkerId(Long workerId);
    Optional<Payment> findByJobId(Long jobId);
    boolean existsByJobId(Long jobId);
    Optional<Payment> findByWorkRequestId(Long workRequestId);
    boolean existsByWorkRequestId(Long workRequestId);
}
