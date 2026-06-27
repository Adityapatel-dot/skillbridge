package com.skillbridge.service;

import com.skillbridge.dto.WorkRequestDTO;
import com.skillbridge.entity.User;
import com.skillbridge.entity.WorkRequest;
import com.skillbridge.enums.RequestStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.WorkRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkRequestService {

    private final WorkRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public WorkRequestDTO sendRequest(WorkRequestDTO requestDTO) {
        User client = getCurrentUser();
        User worker = userRepository.findById(requestDTO.getWorkerId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        WorkRequest workRequest = WorkRequest.builder()
                .jobTitle(requestDTO.getJobTitle())
                .description(requestDTO.getDescription())
                .budget(requestDTO.getBudget())
                .latitude(requestDTO.getLatitude())
                .longitude(requestDTO.getLongitude())
                .address(requestDTO.getAddress())
                .client(client)
                .worker(worker)
                .status(RequestStatus.PENDING)
                .build();

        workRequest = requestRepository.save(workRequest);

        notificationService.createNotification(worker.getId(),
                "You received a work request from " + client.getFullName() + ": " + requestDTO.getJobTitle());

        return mapToResponse(workRequest);
    }

    public List<WorkRequestDTO> getReceivedRequests() {
        User worker = getCurrentUser();
        return requestRepository.findByWorkerId(worker.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<WorkRequestDTO> getSentRequests() {
        User client = getCurrentUser();
        return requestRepository.findByClientId(client.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkRequestDTO acceptRequest(Long requestId) {
        WorkRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getWorker().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only the worker can accept requests");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        request = requestRepository.save(request);

        notificationService.createNotification(request.getClient().getId(),
                "Your work request for: " + request.getJobTitle() + " has been accepted!");

        return mapToResponse(request);
    }

    @Transactional
    public WorkRequestDTO startRequest(Long requestId) {
        WorkRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getWorker().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only the worker can start requests");
        }
        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new BadRequestException("Request must be accepted before starting");
        }

        request.setStatus(RequestStatus.IN_PROGRESS);
        request = requestRepository.save(request);

        notificationService.createNotification(request.getClient().getId(),
                "Work on your request: " + request.getJobTitle() + " has started!");

        return mapToResponse(request);
    }

    @Transactional
    public WorkRequestDTO completeRequest(Long requestId) {
        WorkRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getWorker().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only the worker can complete requests");
        }
        if (request.getStatus() != RequestStatus.IN_PROGRESS) {
            throw new BadRequestException("Request must be in progress before completing");
        }

        request.setStatus(RequestStatus.COMPLETED);
        request = requestRepository.save(request);

        notificationService.createNotification(request.getClient().getId(),
                "Your request: " + request.getJobTitle() + " has been completed!");

        return mapToResponse(request);
    }

    @Transactional
    public WorkRequestDTO approveRequest(Long requestId) {
        WorkRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getClient().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only the client can approve completed requests");
        }
        if (request.getStatus() != RequestStatus.COMPLETED) {
            throw new BadRequestException("Request must be completed before approving");
        }

        request.setStatus(RequestStatus.APPROVED);
        request = requestRepository.save(request);

        notificationService.createNotification(request.getWorker().getId(),
                "Work request: " + request.getJobTitle() + " has been approved by the client!");

        return mapToResponse(request);
    }

    @Transactional
    public WorkRequestDTO rejectRequest(Long requestId) {
        WorkRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getWorker().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only the worker can reject requests");
        }

        request.setStatus(RequestStatus.REJECTED);
        request = requestRepository.save(request);

        notificationService.createNotification(request.getClient().getId(),
                "Your work request for: " + request.getJobTitle() + " has been rejected.");

        return mapToResponse(request);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private WorkRequestDTO mapToResponse(WorkRequest request) {
        return WorkRequestDTO.builder()
                .id(request.getId())
                .jobTitle(request.getJobTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .clientId(request.getClient().getId())
                .clientName(request.getClient().getFullName())
                .workerId(request.getWorker().getId())
                .workerName(request.getWorker().getFullName())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }
}