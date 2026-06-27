package com.skillbridge.controller;

import com.skillbridge.dto.JobRequest;
import com.skillbridge.dto.JobResponse;
import com.skillbridge.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllOpenJobs(
            @RequestParam(required = false) List<String> skills) {
        if (skills != null && !skills.isEmpty()) {
            return ResponseEntity.ok(jobService.getJobsBySkills(skills));
        }
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<JobResponse>> getNearbyJobs(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "50") Double radius) {
        return ResponseEntity.ok(jobService.getNearbyJobs(lat, lng, radius));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobResponse>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.createJob(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign/{workerId}")
    public ResponseEntity<JobResponse> assignWorker(@PathVariable Long id, @PathVariable Long workerId) {
        return ResponseEntity.ok(jobService.assignWorker(id, workerId));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<JobResponse> startJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.startJob(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<JobResponse> completeJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.completeJob(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<JobResponse> approveCompletion(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.approveCompletion(id));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<JobResponse> reviewJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.reviewJob(id));
    }
}