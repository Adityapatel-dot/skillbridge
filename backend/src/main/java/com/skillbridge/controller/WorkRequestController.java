package com.skillbridge.controller;

import com.skillbridge.dto.WorkRequestDTO;
import com.skillbridge.service.WorkRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class WorkRequestController {

    private final WorkRequestService workRequestService;

    @PostMapping
    public ResponseEntity<WorkRequestDTO> sendRequest(@Valid @RequestBody WorkRequestDTO request) {
        return ResponseEntity.ok(workRequestService.sendRequest(request));
    }

    @GetMapping("/received")
    public ResponseEntity<List<WorkRequestDTO>> getReceivedRequests() {
        return ResponseEntity.ok(workRequestService.getReceivedRequests());
    }

    @GetMapping("/sent")
    public ResponseEntity<List<WorkRequestDTO>> getSentRequests() {
        return ResponseEntity.ok(workRequestService.getSentRequests());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<WorkRequestDTO> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(workRequestService.acceptRequest(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<WorkRequestDTO> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(workRequestService.rejectRequest(id));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<WorkRequestDTO> startRequest(@PathVariable Long id) {
        return ResponseEntity.ok(workRequestService.startRequest(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<WorkRequestDTO> completeRequest(@PathVariable Long id) {
        return ResponseEntity.ok(workRequestService.completeRequest(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<WorkRequestDTO> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(workRequestService.approveRequest(id));
    }
}