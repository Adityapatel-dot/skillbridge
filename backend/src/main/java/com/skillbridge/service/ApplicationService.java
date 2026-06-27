package com.skillbridge.service;

import com.skillbridge.dto.ApplicationRequest;
import com.skillbridge.dto.ApplicationResponse;
import com.skillbridge.entity.Job;
import com.skillbridge.entity.JobApplication;
import com.skillbridge.entity.User;
import com.skillbridge.enums.ApplicationStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.JobApplicationRepository;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse applyForJob(ApplicationRequest request) {
        User worker = getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByJobIdAndWorkerId(request.getJobId(), worker.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .worker(worker)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.PENDING)
                .build();

        application = applicationRepository.save(application);

        notificationService.createNotification(job.getClient().getId(),
                worker.getFullName() + " applied for your job: " + job.getTitle());

        return mapToResponse(application);
    }

    public List<ApplicationResponse> getMyApplications() {
        User worker = getCurrentUser();
        return applicationRepository.findByWorkerId(worker.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicantsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsForMyJobs() {
        User client = getCurrentUser();
        return applicationRepository.findByJobClientId(client.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse acceptApplication(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Job job = application.getJob();
        if (!job.getClient().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only job owner can accept applications");
        }

        application.setStatus(ApplicationStatus.ACCEPTED);
        application = applicationRepository.save(application);

        job.setAssignedWorker(application.getWorker());
        job.setStatus(com.skillbridge.enums.JobStatus.ASSIGNED);
        jobRepository.save(job);

        notificationService.createNotification(application.getWorker().getId(),
                "Your application for job: " + job.getTitle() + " has been accepted!");

        return mapToResponse(application);
    }

    @Transactional
    public ApplicationResponse rejectApplication(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Job job = application.getJob();
        if (!job.getClient().getId().equals(getCurrentUser().getId())) {
            throw new BadRequestException("Only job owner can reject applications");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application = applicationRepository.save(application);

        notificationService.createNotification(application.getWorker().getId(),
                "Your application for job: " + job.getTitle() + " has been rejected.");

        return mapToResponse(application);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ApplicationResponse mapToResponse(JobApplication application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .workerId(application.getWorker().getId())
                .workerName(application.getWorker().getFullName())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .build();
    }
}