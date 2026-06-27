package com.skillbridge.service;

import com.skillbridge.dto.PaymentRequest;
import com.skillbridge.dto.PaymentResponse;
import com.skillbridge.entity.Job;
import com.skillbridge.entity.Payment;
import com.skillbridge.entity.User;
import com.skillbridge.entity.WorkRequest;
import com.skillbridge.enums.JobStatus;
import com.skillbridge.enums.PaymentStatus;
import com.skillbridge.enums.RequestStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.PaymentRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.WorkRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WorkRequestRepository workRequestRepository;
    private final NotificationService notificationService;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        User client = getCurrentUser();

        if (request.getWorkRequestId() != null) {
            WorkRequest workRequest = workRequestRepository.findById(request.getWorkRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Work request not found"));

            if (!workRequest.getClient().getId().equals(client.getId())) {
                throw new BadRequestException("Only the client can make payments for their work requests");
            }

            if (workRequest.getStatus() != RequestStatus.APPROVED) {
                throw new BadRequestException("Work request must be approved before payment");
            }

            if (paymentRepository.existsByWorkRequestId(workRequest.getId())) {
                throw new BadRequestException("Payment already processed for this work request");
            }

            Payment payment = Payment.builder()
                    .workRequest(workRequest)
                    .client(client)
                    .worker(workRequest.getWorker())
                    .amount(workRequest.getBudget())
                    .status(PaymentStatus.COMPLETED)
                    .paidAt(LocalDateTime.now())
                    .build();

            payment = paymentRepository.save(payment);

            notificationService.createNotification(workRequest.getWorker().getId(),
                    "Payment received for work request: " + workRequest.getJobTitle());

            return mapToResponse(payment);
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getClient().getId().equals(client.getId())) {
            throw new BadRequestException("Only the job client can make payments");
        }

        if (job.getStatus() != JobStatus.APPROVED && job.getStatus() != JobStatus.REVIEWED) {
            throw new BadRequestException("Job must be approved before payment");
        }

        if (paymentRepository.existsByJobId(job.getId())) {
            throw new BadRequestException("Payment already processed for this job");
        }

        if (job.getAssignedWorker() == null) {
            throw new BadRequestException("No worker assigned to this job");
        }

        Payment payment = Payment.builder()
                .job(job)
                .client(client)
                .worker(job.getAssignedWorker())
                .amount(job.getBudget())
                .status(PaymentStatus.COMPLETED)
                .paidAt(LocalDateTime.now())
                .build();

        payment = paymentRepository.save(payment);

        notificationService.createNotification(job.getAssignedWorker().getId(),
                "Payment received for job: " + job.getTitle());

        return mapToResponse(payment);
    }

    public List<PaymentResponse> getMyPayments() {
        User user = getCurrentUser();
        List<Payment> payments = paymentRepository.findByClientId(user.getId());
        payments.addAll(paymentRepository.findByWorkerId(user.getId()));

        Set<Long> paidJobIds = payments.stream()
                .map(Payment::getJob)
                .filter(Objects::nonNull)
                .map(Job::getId)
                .collect(Collectors.toSet());
        Set<Long> paidWrIds = payments.stream()
                .map(Payment::getWorkRequest)
                .filter(Objects::nonNull)
                .map(WorkRequest::getId)
                .collect(Collectors.toSet());

        List<PaymentResponse> responses = payments.stream()
                .distinct()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        for (Job job : jobRepository.findByClientId(user.getId())) {
            if ((job.getStatus() == JobStatus.APPROVED || job.getStatus() == JobStatus.REVIEWED)
                    && !paidJobIds.contains(job.getId())) {
                responses.add(PaymentResponse.builder()
                        .id(-job.getId())
                        .jobId(job.getId())
                        .jobTitle(job.getTitle())
                        .clientId(job.getClient().getId())
                        .clientName(job.getClient().getFullName())
                        .workerId(job.getAssignedWorker() != null ? job.getAssignedWorker().getId() : null)
                        .workerName(job.getAssignedWorker() != null ? job.getAssignedWorker().getFullName() : null)
                        .amount(job.getBudget())
                        .status(PaymentStatus.PENDING)
                        .createdAt(job.getCompletedAt() != null ? job.getCompletedAt() : job.getCreatedAt())
                        .build());
            }
        }
        for (Job job : jobRepository.findByAssignedWorkerId(user.getId())) {
            if ((job.getStatus() == JobStatus.APPROVED || job.getStatus() == JobStatus.REVIEWED)
                    && !paidJobIds.contains(job.getId())) {
                responses.add(PaymentResponse.builder()
                        .id(-job.getId())
                        .jobId(job.getId())
                        .jobTitle(job.getTitle())
                        .clientId(job.getClient().getId())
                        .clientName(job.getClient().getFullName())
                        .workerId(job.getAssignedWorker() != null ? job.getAssignedWorker().getId() : null)
                        .workerName(job.getAssignedWorker() != null ? job.getAssignedWorker().getFullName() : null)
                        .amount(job.getBudget())
                        .status(PaymentStatus.PENDING)
                        .createdAt(job.getCompletedAt() != null ? job.getCompletedAt() : job.getCreatedAt())
                        .build());
            }
        }

        for (WorkRequest wr : workRequestRepository.findByClientIdAndStatus(user.getId(), RequestStatus.APPROVED)) {
            if (!paidWrIds.contains(wr.getId())) {
                responses.add(PaymentResponse.builder()
                        .id(-wr.getId() - 100000L)
                        .workRequestId(wr.getId())
                        .jobTitle(wr.getJobTitle())
                        .clientId(wr.getClient().getId())
                        .clientName(wr.getClient().getFullName())
                        .workerId(wr.getWorker().getId())
                        .workerName(wr.getWorker().getFullName())
                        .amount(wr.getBudget())
                        .status(PaymentStatus.PENDING)
                        .createdAt(wr.getCreatedAt())
                        .build());
            }
        }
        for (WorkRequest wr : workRequestRepository.findByWorkerIdAndStatus(user.getId(), RequestStatus.APPROVED)) {
            if (!paidWrIds.contains(wr.getId())) {
                responses.add(PaymentResponse.builder()
                        .id(-wr.getId() - 100000L)
                        .workRequestId(wr.getId())
                        .jobTitle(wr.getJobTitle())
                        .clientId(wr.getClient().getId())
                        .clientName(wr.getClient().getFullName())
                        .workerId(wr.getWorker().getId())
                        .workerName(wr.getWorker().getFullName())
                        .amount(wr.getBudget())
                        .status(PaymentStatus.PENDING)
                        .createdAt(wr.getCreatedAt())
                        .build());
            }
        }

        return responses;
    }

    public PaymentResponse getPaymentByJob(Long jobId) {
        Payment payment = paymentRepository.findByJobId(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for this job"));
        return mapToResponse(payment);
    }

    public PaymentResponse getPaymentByWorkRequest(Long workRequestId) {
        Payment payment = paymentRepository.findByWorkRequestId(workRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for this work request"));
        return mapToResponse(payment);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse.PaymentResponseBuilder builder = PaymentResponse.builder()
                .id(payment.getId())
                .clientId(payment.getClient().getId())
                .clientName(payment.getClient().getFullName())
                .workerId(payment.getWorker().getId())
                .workerName(payment.getWorker().getFullName())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt());

        if (payment.getJob() != null) {
            builder.jobId(payment.getJob().getId())
                   .jobTitle(payment.getJob().getTitle());
        } else if (payment.getWorkRequest() != null) {
            builder.workRequestId(payment.getWorkRequest().getId())
                   .jobTitle(payment.getWorkRequest().getJobTitle());
        }

        return builder.build();
    }
}
