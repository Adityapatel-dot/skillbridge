package com.skillbridge.controller;

import com.skillbridge.dto.ProfileUpdateRequest;
import com.skillbridge.dto.UserProfileResponse;
import com.skillbridge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @GetMapping("/workers")
    public ResponseEntity<List<UserProfileResponse>> getAllWorkers() {
        return ResponseEntity.ok(userService.getAllWorkers());
    }

    @GetMapping("/workers/by-skill")
    public ResponseEntity<List<UserProfileResponse>> getWorkersBySkill(@RequestParam String skill) {
        return ResponseEntity.ok(userService.getWorkersBySkill(skill));
    }
}