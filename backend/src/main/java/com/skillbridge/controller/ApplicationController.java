package com.skillbridge.controller;

import com.skillbridge.dto.ApplicationRequest;
import com.skillbridge.dto.ApplicationResponse;
import com.skillbridge.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponse> applyForJob(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForJob(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicantsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId));
    }

    @GetMapping("/received")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForMyJobs() {
        return ResponseEntity.ok(applicationService.getApplicationsForMyJobs());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApplicationResponse> acceptApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.acceptApplication(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApplicationResponse> rejectApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.rejectApplication(id));
    }
}