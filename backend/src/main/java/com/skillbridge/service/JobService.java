package com.skillbridge.service;

import com.skillbridge.dto.JobRequest;
import com.skillbridge.dto.JobResponse;
import com.skillbridge.entity.Job;
import com.skillbridge.entity.JobApplication;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.enums.JobStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.JobApplicationRepository;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final NotificationService notificationService;
    private final JobApplicationRepository jobApplicationRepository;

    public List<JobResponse> getAllOpenJobs() {
        return jobRepository.findAllOpenJobs().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsBySkills(List<String> skills) {
        return jobRepository.findOpenJobsBySkills(skills).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getMyJobs() {
        User user = getCurrentUser();
        List<Job> jobs = jobRepository.findByClientId(user.getId());
        jobs.addAll(jobRepository.findByAssignedWorkerId(user.getId()));

        if (user.getRole().name().equals("WORKER")) {
            List<JobApplication> applications = jobApplicationRepository.findByWorkerId(user.getId());
            for (JobApplication app : applications) {
                jobs.add(app.getJob());
            }
        }

        return jobs.stream()
                .distinct()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
        return mapToResponse(job);
    }

    public List<JobResponse> getNearbyJobs(Double lat, Double lng, Double radius) {
        return jobRepository.findNearbyOpenJobs(lat, lng, radius).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponse createJob(JobRequest request) {
        User client = getCurrentUser();

        Double lat = request.getLatitude();
        Double lng = request.getLongitude();
        String addr = request.getAddress();

        if (addr == null || addr.isBlank()) {
            if (lat != null && lng != null) {
                addr = lat + ", " + lng;
            } else {
                addr = "Location not specified";
            }
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .deadline(request.getDeadline())
                .latitude(lat)
                .longitude(lng)
                .address(addr)
                .status(JobStatus.OPEN)
                .client(client)
                .build();

        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getRequiredSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> {
                            Skill newSkill = Skill.builder()
                                    .name(skillName.trim())
                                    .category("General")
                                    .build();
                            return skillRepository.save(newSkill);
                        });
                skills.add(skill);
            }
            job.setRequiredSkills(skills);
        }

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        User client = getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        if (!job.getClient().getId().equals(client.getId())) {
            throw new BadRequestException("You can only update your own jobs");
        }

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getBudget() != null) job.setBudget(request.getBudget());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getLatitude() != null) job.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) job.setLongitude(request.getLongitude());
        if (request.getAddress() != null) job.setAddress(request.getAddress());

        if (request.getRequiredSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getRequiredSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> {
                            Skill newSkill = Skill.builder()
                                    .name(skillName.trim())
                                    .category("General")
                                    .build();
                            return skillRepository.save(newSkill);
                        });
                skills.add(skill);
            }
            job.setRequiredSkills(skills);
        }

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        User client = getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        if (!job.getClient().getId().equals(client.getId())) {
            throw new BadRequestException("You can only delete your own jobs");
        }

        jobRepository.delete(job);
    }

    @Transactional
    public JobResponse assignWorker(Long jobId, Long workerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        job.setAssignedWorker(worker);
        job.setStatus(JobStatus.ASSIGNED);
        job = jobRepository.save(job);

        notificationService.createNotification(worker.getId(),
                "You have been assigned to job: " + job.getTitle());

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse startJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.ASSIGNED) {
            throw new BadRequestException("Job must be in ASSIGNED status to start");
        }
        job.setStatus(JobStatus.IN_PROGRESS);
        job = jobRepository.save(job);

        notificationService.createNotification(job.getClient().getId(),
                "Job \"" + job.getTitle() + "\" is now in progress");

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse completeJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.IN_PROGRESS) {
            throw new BadRequestException("Job must be in IN_PROGRESS status to complete");
        }
        job.setStatus(JobStatus.COMPLETED);
        job.setCompletedAt(LocalDateTime.now());
        job = jobRepository.save(job);

        notificationService.createNotification(job.getClient().getId(),
                "Job \"" + job.getTitle() + "\" has been marked as completed");

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse approveCompletion(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.COMPLETED) {
            throw new BadRequestException("Job must be in COMPLETED status to approve");
        }
        job.setStatus(JobStatus.APPROVED);
        job = jobRepository.save(job);

        notificationService.createNotification(job.getAssignedWorker().getId(),
                "Job \"" + job.getTitle() + "\" has been approved by the client");

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse reviewJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.APPROVED) {
            throw new BadRequestException("Job must be approved before review");
        }
        job.setStatus(JobStatus.REVIEWED);
        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private JobResponse mapToResponse(Job job) {
        Set<String> skillNames = job.getRequiredSkills() != null
                ? job.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet())
                : new HashSet<>();

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .budget(job.getBudget())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .clientName(job.getClient().getFullName())
                .clientId(job.getClient().getId())
                .assignedWorkerName(job.getAssignedWorker() != null ? job.getAssignedWorker().getFullName() : null)
                .assignedWorkerId(job.getAssignedWorker() != null ? job.getAssignedWorker().getId() : null)
                .requiredSkills(skillNames)
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .address(job.getAddress())
                .completedAt(job.getCompletedAt())
                .createdAt(job.getCreatedAt())
                .build();
    }
}